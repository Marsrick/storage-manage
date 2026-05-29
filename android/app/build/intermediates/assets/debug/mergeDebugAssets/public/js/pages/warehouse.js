/**
 * 仓库管理页
 */
window.Pages = window.Pages || {};
window.Pages['/warehouse'] = {
  render() {
    const warehouses = Store.warehouses.getAll();
    return `
      <div class="page">
        ${UI.header('仓库管理')}
        <div class="page-content has-footer-btn">
          <div style="padding-top:12px;">
            ${warehouses.length === 0 ? UI.empty('暂无仓库，请添加') : ''}
            <div class="manage-list">
              ${warehouses.map(w => `
                <div class="manage-item" data-id="${w.id}">
                  <span class="item-name">${w.name}</span>
                  <div class="item-actions">
                    <button class="btn-more" onclick="Pages['/warehouse'].onMore('${w.id}')">
                      ${UI.icon('more')}
                    </button>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
        <div class="footer-btn-fixed">
          <button class="btn-primary" onclick="Pages['/warehouse'].onAdd()">新 增 仓 库</button>
        </div>
      </div>
    `;
  },

  async onAdd() {
    const name = await UI.inputModal('新增仓库', '请输入仓库名称');
    if (name) {
      Store.warehouses.add({ name });
      UI.toast('添加成功', 'success');
      Router.refresh();
    }
  },

  async onMore(id) {
    const warehouse = Store.warehouses.getById(id);
    if (!warehouse) return;
    const idx = await UI.actionSheet([
      { label: '编辑' },
      { label: '删除', danger: true }
    ]);
    if (idx === 0) {
      const newName = await UI.inputModal('编辑仓库', '请输入仓库名称', warehouse.name);
      if (newName) {
        Store.warehouses.update(id, { name: newName });
        UI.toast('修改成功', 'success');
        Router.refresh();
      }
    } else if (idx === 1) {
      const ok = await UI.confirm('确定删除该仓库？');
      if (ok) {
        Store.warehouses.remove(id);
        UI.toast('删除成功', 'success');
        Router.refresh();
      }
    }
  }
};
