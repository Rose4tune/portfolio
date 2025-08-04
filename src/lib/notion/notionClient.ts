import { NotionAPI } from "notion-client";

// 브라우저와 서버 환경 모두에서 작동하는 디버그 로그 함수
function debugLog(...args: unknown[]) {
  // 클라이언트 측에서는 window 객체가 있고, 서버 측에서는 없음
  const isClient = typeof window !== 'undefined';
  
  // 로그 메시지를 문자열로 변환
  const message = args.map(arg => 
    typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
  ).join(' ');
  
  // 브라우저 콘솔에 출력
  if (isClient) {
    console.log(`%c[NOTION API DEBUG] ${message}`, 'background: #f0f0f0; color: #0070f3; padding: 2px 4px; border-radius: 2px;');
  } else {
    // 서버 환경에서는 일반 로그로 출력
    console.log(`[NOTION API DEBUG] ${message}`);
  }
}

// Notion API 구성 정보 로깅
debugLog('Notion Auth Config:', {
  apiBaseUrl: "https://www.notion.so/api/v3",
  userTimeZone: "Asia/Seoul",
  activeUser: process.env.NOTION_ACTIVE_USER ? "설정됨" : "설정되지 않음",
  authToken: process.env.NOTION_TOKEN_V2 ? "설정됨" : "설정되지 않음",
  environment: process.env.NODE_ENV,
  origin: process.env.NEXT_PUBLIC_SITE_URL || 'https://rose4tune-portfolio.vercel.app'
});

const notionApi = new NotionAPI({
  apiBaseUrl: "https://www.notion.so/api/v3",
  userTimeZone: "Asia/Seoul",
  activeUser: process.env.NOTION_ACTIVE_USER,
  authToken: process.env.NOTION_TOKEN_V2,
  kyOptions: {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36',
      'Origin': process.env.NEXT_PUBLIC_SITE_URL || 'https://rose4tune-portfolio.vercel.app',
      'Referer': 'https://www.notion.so/',
      'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
      'Accept': 'application/json',
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache'
    },
    timeout: 60000,
    retry: {
      limit: 5,
      methods: ['get', 'post'],
      statusCodes: [408, 413, 429, 500, 502, 503, 504]
    },
    hooks: {
      beforeRequest: [
        request => {
          debugLog('Notion API 요청 시작:', {
            url: request.url.toString(),
            headers: Object.fromEntries(request.headers.entries()),
            method: request.method
          });
        }
      ],
      afterResponse: [
        (_request, _options, response) => {
          const status = response.status;
          const isSuccess = response.ok;
          
          debugLog('Notion API 응답 받음:', {
            status,
            isSuccess,
            url: response.url,
            statusText: response.statusText,
            headers: Object.fromEntries(response.headers.entries())
          });
          
          return response;
        }
      ],
      beforeError: [
        error => {
          debugLog('Notion API 요청 에러:', {
            name: error.name,
            message: error.message,
            request: {
              url: error.request?.url,
              method: error.request?.method
            },
            response: error.response ? {
              status: error.response.status,
              statusText: error.response.statusText
            } : 'No response'
          });
          
          return error;
        }
      ]
    }
  }
});

async function withRetry<T>(
  fn: () => Promise<T>,
  retries = 5,
  delay = 2000,
  timeout = 30000
): Promise<T> {
  try {
    debugLog('작업 시작 (withRetry)', {
      retriesLeft: retries,
      timeout,
      timestamp: new Date().toISOString()
    });
    
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error(`Operation timed out after ${timeout}ms`)), timeout);
    });
    
    const result = await Promise.race([fn(), timeoutPromise]);
    
    debugLog('작업 성공 (withRetry)', {
      timestamp: new Date().toISOString(),
      hasResult: !!result
    });
    
    return result;
  } catch (error: unknown) {
    if (retries <= 0) {
      debugLog('모든 재시도 실패 (withRetry)', {
        error: error instanceof Error ? {
          name: error.name,
          message: error.message,
          stack: error.stack
        } : String(error),
        timestamp: new Date().toISOString()
      });
      
      if (error instanceof Error) {
        const errorObj = error as unknown as Record<string, unknown>;
        debugLog('최종 실패 상세 정보:', {
          name: error.name,
          message: error.message,
          code: errorObj.code || 'N/A',
          statusCode: errorObj.statusCode || 'N/A',
          requestUrl: errorObj.requestUrl || 'N/A',
          timestamp: new Date().toISOString()
        });
      }
      
      throw error;
    }

    debugLog(`재시도 중... (${retries} 회 남음)`, {
      error: error instanceof Error ? error.message : String(error),
      nextRetryDelay: delay,
      timestamp: new Date().toISOString()
    });
    await new Promise((resolve) => setTimeout(resolve, delay));

    return withRetry(fn, retries - 1, delay * 1.5, timeout);
  }
}

export async function getRecordMap(pageId: string) {
  if (!pageId) {
    debugLog("Error: Invalid pageId provided to getRecordMap");
    throw new Error("Invalid pageId");
  }

  const formats = [
    pageId,
    pageId.replace(/-/g, ""),
    pageId.split("-")[0],
    pageId.includes("-") ? pageId.split("-").slice(1).join("-") : pageId,
  ];

  debugLog('getRecordMap 함수 호출됨', {
    originalPageId: pageId,
    formats: formats,
    timestamp: new Date().toISOString()
  });

  let lastError: Error | unknown = null;

  for (const idFormat of formats) {
    try {
      debugLog(`Notion 페이지 가져오기 시도 중: ${idFormat}`, {
        format: idFormat,
        attempt: formats.indexOf(idFormat) + 1,
        totalFormats: formats.length,
        timestamp: new Date().toISOString()
      });

      const recordMap = await withRetry(
        () => notionApi.getPage(idFormat),
        5,
        2000,
        30000
      );

      if (!recordMap || !recordMap.block || Object.keys(recordMap.block).length === 0) {
        debugLog(`빈 recordMap 반환됨 (ID: ${idFormat})`, {
          timestamp: new Date().toISOString()
        });
        throw new Error("Empty recordMap returned from Notion API");
      }

      debugLog(`✅ Notion 페이지를 성공적으로 가져옴 (ID: ${idFormat})`, {
        blockCount: Object.keys(recordMap.block || {}).length,
        hasCollection: !!recordMap.collection && Object.keys(recordMap.collection || {}).length > 0,
        hasCollectionView: !!recordMap.collection_view && Object.keys(recordMap.collection_view || {}).length > 0,
        timestamp: new Date().toISOString()
      });
      
      return recordMap;
    } catch (error: unknown) {
      if (error instanceof Error) {
        debugLog(`상세 에러 정보 (ID: ${idFormat})`, {
          name: error.name,
          message: error.message,
          stack: error.stack,
          environment: process.env.NODE_ENV,
          errorObject: JSON.stringify(error, Object.getOwnPropertyNames(error), 2),
          timestamp: new Date().toISOString()
        });
      } else {
        debugLog(`비표준 에러 객체 (ID: ${idFormat})`, {
          errorString: String(error),
          type: typeof error,
          environment: process.env.NODE_ENV,
          details: JSON.stringify(error),
          timestamp: new Date().toISOString()
        });
      }
      
      debugLog(`ID 형식 ${idFormat}로 시도 실패`, {
        error: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString()
      });
      
      lastError = error;
    }
  }

  debugLog(`❌ 모든 ID 형식이 pageId에 대해 실패: ${pageId}`, {
    timestamp: new Date().toISOString()
  });
  
  if (lastError instanceof Error) {
    throw new Error(`Failed to fetch Notion page: ${lastError.message}`);
  } else {
    throw new Error(`Failed to fetch Notion page with unknown error`);
  }
}
