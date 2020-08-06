'use strict';

const Service = require('egg').Service;

class NewsService extends Service {
  async list(page = 1) {
    const { serveUrl, pageSize } = this.config.news;

    const { data: idList } = await this.ctx.curl(`${serveUrl}/topstories.json`, {
      data: {
        orderBy: '"$key"',
        startAt: `"${pageSize * (page - 1)}"`,
        endAt: `"${pageSize * page - 1}"`,
      },
      dataType: 'json',
    });
    // parallel GET detail
    const newsList = await Promise.all(Object.keys(idList).map(key => {
      const url = `${serveUrl}/item/${idList[key]}.json`;
      return this.ctx.curl(url, { dataType: 'json' });
    }));
    return newsList.map(res => res.data);
  }

}

module.exports = NewsService;
