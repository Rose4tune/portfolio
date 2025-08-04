import { Client, PageObjectResponse } from '@notionhq/client';

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
    console.log(`%c[NOTIONHQ API DEBUG] ${message}`, 'background: #f0f0f0; color: #7928ca; padding: 2px 4px; border-radius: 2px;');
  } else {
    // 서버 환경에서는 일반 로그로 출력
    console.log(`[NOTIONHQ API DEBUG] ${message}`);
  }
}

// NotionHQ API 구성 정보 로깅
debugLog('NotionHQ Client Environment:', {
  environment: process.env.NODE_ENV,
  apiKey: process.env.NOTION_API_KEY ? "설정됨" : "설정되지 않음",
  dbIdBlog: process.env.NOTION_DB_ID_BLOG ? "설정됨" : "설정되지 않음",
  dbIdProject: process.env.NOTION_DB_ID_PROJECT ? "설정됨" : "설정되지 않음",
  dbIdBook: process.env.NOTION_DB_ID_BOOK ? "설정됨" : "설정되지 않음",
  timestamp: new Date().toISOString()
});

const NOTION_API_KEY = process.env.NOTION_API_KEY;
if (!NOTION_API_KEY) {
  debugLog('Error: NOTION_API_KEY is not defined in environment variables');
}

const NOTION_DB = {
  blog: process.env.NOTION_DB_ID_BLOG as string,
  project: process.env.NOTION_DB_ID_PROJECT as string,
  book: process.env.NOTION_DB_ID_BOOK as string,
};

Object.entries(NOTION_DB).forEach(([key, value]) => {
  if (!value) {
    debugLog(`Error: NOTION_DB_ID_${key.toUpperCase()} is not defined in environment variables`);
  }
});

// Notion API 클라이언트 초기화
debugLog('Creating Notion client with API key');
const notion = new Client({
  auth: NOTION_API_KEY,
});

export enum PostType {
  blog = "blog",
  project = "project",
  book = "book",
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  date: string;
  tags: string[];
  excerpt?: string;
  content?: string;
}

export interface ProjectPost {
  id: string;
  title: string;
  slug: string;
  date: string;
  tags: string[];
  status?: string;
  techStack?: string[];
}

export interface BookPost {
  id: string;
  title: string;
  slug: string;
  date: string;
  tags: string[];
  author?: string;
  rating?: number;
}

export async function getPosts(type: PostType.blog): Promise<BlogPost[]>;
export async function getPosts(type: PostType.project): Promise<ProjectPost[]>;
export async function getPosts(type: PostType.book): Promise<BookPost[]>;
export async function getPosts(type: PostType): Promise<BlogPost[] | ProjectPost[] | BookPost[]>;

export async function getPosts(type: PostType) {
  debugLog(`getPosts 함수 호출됨 (타입: ${type})`, {
    timestamp: new Date().toISOString()
  });
  
  const database_id = NOTION_DB[type];
  
  if (!database_id) {
    debugLog(`에러: ${type} 타입의 데이터베이스 ID가 정의되지 않음. 환경 변수를 확인하세요.`, {
      type,
      availableDbs: Object.keys(NOTION_DB),
      timestamp: new Date().toISOString()
    });
    return [];
  }
  
  try {
    debugLog(`Notion 데이터베이스 쿼리 시작 (타입: ${type})`, {
      databaseId: database_id,
      filter: "숨김 = false",
      sort: "작성일 내림차순",
      timestamp: new Date().toISOString()
    });
    
    const response = await notion.databases.query({
      database_id,
      filter: {
        property: "숨김",
        checkbox: {
          equals: false,
        },
      },
      sorts: [
        {
          property: "작성일",
          direction: "descending",
        },
      ],
    });

    const pages = response.results as PageObjectResponse[];
    
    debugLog(`Notion 데이터베이스 쿼리 완료 (타입: ${type})`, {
      resultsCount: pages.length,
      timestamp: new Date().toISOString()
    });
    
    const posts = await Promise.all(
      pages.map(async (page) => {
        const properties = page.properties;
        const title = getPropertyValue(properties["이름"]) as string;
        const slug = generateSlug(title);
        const date = getPropertyValue(properties["작성일"]) as string;
        const tags = getPropertyValue(properties["키워드"]) as string[];

        const basePost = {
          id: page.id,
          title,
          slug,
          date,
          tags,
        };

        switch (type) {
          case PostType.blog:
            const excerpt = getPropertyValue(properties["요약"]) as string;
            const content = excerpt || (await getPageFirstContent(page.id));
            return {
              ...basePost,
              excerpt,
              content,
            } as BlogPost;
            
          case PostType.project:
            return {
              ...basePost,
              status: getPropertyValue(properties["상태"]) as string,
              techStack: getPropertyValue(properties["기술스택"]) as string[],
            } as ProjectPost;
            
          case PostType.book:
            return {
              ...basePost,
              author: getPropertyValue(properties["저자"]) as string,
              rating: getPropertyValue(properties["평점"]) as number,
            } as BookPost;

          default:
            return basePost;
        }
      })
    );

    return posts;
  } catch (error) {
    debugLog(`에러: ${type} 타입의 포스트 가져오기 실패`, {
      type,
      error: error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: error.stack
      } : String(error),
      timestamp: new Date().toISOString()
    });
    return [];
  }
}


export async function getPageIdBySlug(
  type: PostType,
  slug: string
): Promise<string | null> {
  
  debugLog(`getPageIdBySlug 함수 호출됨`, {
    type,
    slug,
    timestamp: new Date().toISOString()
  });
  
  if (!slug || typeof slug !== 'string') {
    debugLog(`에러: 유효하지 않은 slug 제공됨`, {
      slug,
      type: typeof slug,
      timestamp: new Date().toISOString()
    });
    return null;
  }

  const database_id = NOTION_DB[type];
  
  if (!database_id) {
    debugLog(`에러: ${type} 타입의 데이터베이스 ID가 정의되지 않음. 환경 변수를 확인하세요.`, {
      type,
      availableDbs: Object.keys(NOTION_DB),
      timestamp: new Date().toISOString()
    });
    return null;
  }
  
  debugLog(`slug로 페이지 검색 중: "${slug}", 데이터베이스 타입: "${type}"`, {
    databaseId: database_id,
    timestamp: new Date().toISOString()
  });
  
  try {
    const response = await notion.databases.query({
      database_id,
      filter: {
        property: "숨김",
        checkbox: { equals: false },
      },
    });

    const pages = response.results as PageObjectResponse[];
    debugLog(`데이터베이스에서 ${pages.length}개의 페이지 찾음`, {
      databaseType: type,
      timestamp: new Date().toISOString()
    });
    
    for (const page of pages) {
      const title = getPropertyValue(page.properties["이름"]) as string;
      const generatedSlug = generateSlug(title);

      debugLog(`페이지 확인 중`, {
        title,
        generatedSlug,
        pageId: page.id,
        targetSlug: slug,
        isMatch: generatedSlug === slug,
        timestamp: new Date().toISOString()
      });

      if (generatedSlug === slug) {
        debugLog(`✅ 일치하는 페이지 찾음. ID 반환: ${page.id}`, {
          title,
          slug: generatedSlug,
          timestamp: new Date().toISOString()
        });
        return page.id;
      }
    }
    
    debugLog(`❌ slug와 일치하는 페이지를 찾을 수 없음: "${slug}"`, {
      databaseType: type,
      timestamp: new Date().toISOString()
    });
    return null;
  } catch (error) {
    debugLog(`에러: slug로 페이지 찾기 실패: ${slug}`, {
      error: error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: error.stack
      } : String(error),
      timestamp: new Date().toISOString()
    });
    return null;
  }
}



function getPropertyValue(
  property: PageObjectResponse['properties'][string]
): string | string[] | number | boolean {
  if (!property) return "";

  switch (property.type) {
    case "title":
      return property.title?.map((t) => t.plain_text).join("") || "";
    case "rich_text":
      return property.rich_text?.[0]?.plain_text || "";
    case "date":
      const date = property.date?.start || "";
      return new Date(date).toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    case "select":
      return property.select?.name || "";
    case "multi_select":
      return property.multi_select?.map((item) => item.name) || [];
    case "number":
      return property.number || 0;
    case "checkbox":
      return property.checkbox || false;
    default:
      return "";
  }
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+$/, "");
}

export async function getUniqueTags(type: PostType): Promise<string[]> {
  debugLog(`getUniqueTags 함수 호출됨 (타입: ${type})`, {
    timestamp: new Date().toISOString()
  });
  
  const database_id = NOTION_DB[type];
  
  if (!database_id) {
    debugLog(`에러: ${type} 타입의 데이터베이스 ID가 정의되지 않음. 환경 변수를 확인하세요.`, {
      type,
      availableDbs: Object.keys(NOTION_DB),
      timestamp: new Date().toISOString()
    });
    return [];
  }
  
  try {
    debugLog(`Notion 데이터베이스 쿼리 시작 (태그 가져오기, 타입: ${type})`, {
      databaseId: database_id,
      timestamp: new Date().toISOString()
    });
    
    const response = await notion.databases.query({
      database_id,
      filter: {
        property: "숨김",
        checkbox: { equals: false },
      },
    });

    const pages = response.results as PageObjectResponse[];
    debugLog(`Notion 데이터베이스 쿼리 완료 (태그 가져오기)`, {
      pagesCount: pages.length,
      timestamp: new Date().toISOString()
    });
    
    const allTags = pages.flatMap((page) => {
      const tags = getPropertyValue(page.properties["키워드"]) as string[];
      return tags;
    });
    
    const uniqueTags = [...new Set(allTags)].sort();
    
    debugLog(`고유 태그 목록 생성 완료`, {
      totalTags: allTags.length,
      uniqueTags: uniqueTags.length,
      tags: uniqueTags,
      timestamp: new Date().toISOString()
    });
    
    return uniqueTags;
  } catch (error) {
    debugLog(`에러: ${type} 타입의 태그 가져오기 실패`, {
      error: error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: error.stack
      } : String(error),
      timestamp: new Date().toISOString()
    });
    return [];
  }
}

export async function getPageFirstContent(pageId: string): Promise<string> {
  debugLog(`getPageFirstContent 함수 호출됨`, {
    pageId,
    timestamp: new Date().toISOString()
  });
  
  try {
    debugLog(`Notion 블록 목록 요청 시작`, {
      blockId: pageId,
      pageSize: 10,
      timestamp: new Date().toISOString()
    });
    
    const response = await notion.blocks.children.list({
      block_id: pageId,
      page_size: 10,
    });

    debugLog(`Notion 블록 목록 요청 완료`, {
      blockCount: response.results.length,
      hasMore: response.has_more,
      timestamp: new Date().toISOString()
    });

    let content = '';
    for (const block of response.results) {
      if ('type' in block) {
        debugLog(`블록 처리 중`, {
          blockId: block.id,
          blockType: block.type,
          timestamp: new Date().toISOString()
        });
        
        switch (block.type) {
          case 'paragraph':
            if (block.paragraph?.rich_text) {
              const paragraphText = block.paragraph.rich_text.map(text => text.plain_text).join('');
              content += paragraphText + '\n';
              debugLog(`단락 텍스트 추가됨`, {
                textLength: paragraphText.length,
                timestamp: new Date().toISOString()
              });
            }
            break;
          case 'heading_1':
            if (block.heading_1?.rich_text) {
              const headingText = block.heading_1.rich_text.map(text => text.plain_text).join('');
              content += '# ' + headingText + '\n';
              debugLog(`제목1 텍스트 추가됨`, {
                textLength: headingText.length,
                timestamp: new Date().toISOString()
              });
            }
            break;
          case 'heading_2':
            if (block.heading_2?.rich_text) {
              const headingText = block.heading_2.rich_text.map(text => text.plain_text).join('');
              content += '## ' + headingText + '\n';
              debugLog(`제목2 텍스트 추가됨`, {
                textLength: headingText.length,
                timestamp: new Date().toISOString()
              });
            }
            break;
          case 'heading_3':
            if (block.heading_3?.rich_text) {
              const headingText = block.heading_3.rich_text.map(text => text.plain_text).join('');
              content += '### ' + headingText + '\n';
              debugLog(`제목3 텍스트 추가됨`, {
                textLength: headingText.length,
                timestamp: new Date().toISOString()
              });
            }
            break;
          case 'bulleted_list_item':
            if (block.bulleted_list_item?.rich_text) {
              const bulletText = block.bulleted_list_item.rich_text.map(text => text.plain_text).join('');
              content += '• ' + bulletText + '\n';
              debugLog(`불릿 목록 추가됨`, {
                textLength: bulletText.length,
                timestamp: new Date().toISOString()
              });
            }
            break;
          case 'numbered_list_item':
            if (block.numbered_list_item?.rich_text) {
              const numberedText = block.numbered_list_item.rich_text.map(text => text.plain_text).join('');
              content += '1. ' + numberedText + '\n';
              debugLog(`번호 목록 추가됨`, {
                textLength: numberedText.length,
                timestamp: new Date().toISOString()
              });
            }
            break;
        }
      }
      
      if (content.length > 100) break;
    }

    const trimmedContent = content.trim().substring(0, 200);
    debugLog(`페이지 첫 번째 콘텐츠 생성 완료`, {
      contentLength: trimmedContent.length,
      excerpt: trimmedContent.substring(0, 50) + '...',
      timestamp: new Date().toISOString()
    });
    
    return trimmedContent;
  } catch (error) {
    debugLog(`에러: 페이지 첫 번째 콘텐츠 가져오기 실패`, {
      pageId,
      error: error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: error.stack
      } : String(error),
      timestamp: new Date().toISOString()
    });
    return '';
  }
}