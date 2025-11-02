declare module "rss" {
  interface FeedItem {
    title: string;
    description?: string;
    url: string;
    date?: string | Date;
    author?: string;
  }

  interface FeedOptions {
    title: string;
    description?: string;
    feed_url?: string;
    site_url?: string;
    image_url?: string;
    docs?: string;
    managingEditor?: string;
    webMaster?: string;
    language?: string;
    categories?: string[];
    pubDate?: string | Date;
    ttl?: number;
    lastBuildDate?: string | Date;
  }

  export default class RSS {
    constructor(options: FeedOptions);
    item(item: FeedItem): void;
    xml(options?: { indent?: boolean | string }): string;
  }
}
