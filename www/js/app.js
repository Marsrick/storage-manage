/**
 * App - 路由管理 & 应用初始化
 */
window.Router = {
  currentPath: '/',

  init() {
    // 初始化演示数据
    Store.initDemo();

    // 监听路由变化
    window.addEventListener('hashchange', () => this.handleRoute());

    // 处理初始路由
    this.handleRoute();
  },

  handleRoute() {
    const hash = location.hash.slice(1) || '/';
    const [path, queryStr] = hash.split('?');
    this.currentPath = path;

    const page = window.Pages[path];
    if (page) {
      const app = document.getElementById('app');
      app.innerHTML = page.render();
      if (page.afterRender) {
        page.afterRender();
      }
    } else {
      // 未找到页面，跳转首页
      location.hash = '#/';
    }
  },

  navigate(path) {
    location.hash = '#' + path;
  },

  back() {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      this.navigate('/');
    }
  },

  refresh() {
    this.handleRoute();
  },

  getParams() {
    const hash = location.hash.slice(1);
    const [, queryStr] = hash.split('?');
    if (!queryStr) return {};
    const params = {};
    queryStr.split('&').forEach(pair => {
      const [key, value] = pair.split('=');
      if (key) params[decodeURIComponent(key)] = decodeURIComponent(value || '');
    });
    return params;
  }
};

// 统计分析占位页
window.Pages = window.Pages || {};
window.Pages['/stats'] = {
  render() {
    return `
      <div class="page">
        ${UI.header('统计分析', { showBack: false })}
        <div class="page-content has-tabbar">
          ${UI.empty('统计分析功能开发中...')}
        </div>
        ${UI.tabbar('stats')}
      </div>
    `;
  }
};

// 团队占位页
window.Pages['/team'] = {
  render() {
    return `
      <div class="page">
        ${UI.header('团队', { showBack: false })}
        <div class="page-content has-tabbar">
          ${UI.empty('团队功能开发中...')}
        </div>
        ${UI.tabbar('team')}
      </div>
    `;
  }
};

// 应用启动
document.addEventListener('DOMContentLoaded', () => {
  Router.init();
});
