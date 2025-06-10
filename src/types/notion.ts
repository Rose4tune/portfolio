import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";

export type NotionPost = PageObjectResponse;

type NotionPropertyValue = {
  id: string;
  type: string;
};

type NotionTitleProperty = NotionPropertyValue & {
  type: "title";
  title: Array<{
    plain_text: string;
  }>;
};

type NotionRichTextProperty = NotionPropertyValue & {
  type: "rich_text";
  rich_text: Array<{
    plain_text: string;
  }>;
};

type NotionDateProperty = NotionPropertyValue & {
  type: "date";
  date: {
    start: string;
  };
};

type NotionCheckboxProperty = NotionPropertyValue & {
  type: "checkbox";
  checkbox: boolean;
};

export interface NotionProperties {
  이름: NotionTitleProperty;
  설명?: NotionRichTextProperty;
  작성일: NotionDateProperty;
  숨김: NotionCheckboxProperty;
}
