/**
 * 商品分类管理页
 */
window.Pages = window.Pages || {};
window.Pages['/category'] = {
  render() {
    const categories = Store.categories.getAll();
    return `
      <div class="page">
        ${UI.header('商品分类管理')}
        <div class="page-content has-footer-btn">
          <div style="padding-top:12px;">
            ${categories.length === 0 ? UI.empty('暂无分类，请添加') : ''}
            <div class="manage-list">
              ${categories.map(c => `
                <div class="manage-item" data-id="${c.id}">
                  <span class="item-name">${c.name}</span>
                  <div class="item-actions">
                    <button class="btn-more" onclick="Pages['/category'].onMore('${c.id}')">
                      ${UI.icon('more')}
                    </button>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
        <div class="footer-btn-fixed">
          <button class="btn-primary" onclick="Pages['/category'].onAdd()">新 增 一 级 分 类</button>
        </div>
      </div>
    `;
  },

  async onAdd() {
    const name = await UI.inputModal('新增分类', '请输入分类名称');
    if (name) {
      Store.categories.add({ name });
      UI.toast('添加成功', 'success');
      Router.refresh();
    }
  },

  async onMore(id) {
    const category = Store.categories.getById(id);
    if (!category) return;
    const idx = await UI.actionSheet([
      { label: '编辑' },
      { label: '删除', danger: true }
    ]);
    if (idx === 0) {
      const newName = await UI.inputModal('编辑分类', '请输入分类名称', category.name);
      if (newName) {
        Store.categories.update(id, { name: newName });
        UI.toast('修改成功', 'success');
        Router.refresh();
      }
    } else if (idx === 1) {
      const ok = await UI.confirm('确定删除该分类？关联的商品将失去分类。');
      if (ok) {
        Store.categories.remove(id);
        UI.toast('删除成功', 'success');
        Router.refresh();
      }
    }
  }
};
