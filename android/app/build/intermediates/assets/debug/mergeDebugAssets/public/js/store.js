/**
 * Store - 数据存储层 (localStorage)
 * 管理仓库、分类、商品、往来单位、出入库单据等所有业务数据
 */
window.Store = (() => {
  const KEYS = {
    WAREHOUSES: 'wms_warehouses',
    CATEGORIES: 'wms_categories',
    PRODUCTS: 'wms_products',
    PARTNERS: 'wms_partners',
    STOCK_IN: 'wms_stock_in',
    STOCK_OUT: 'wms_stock_out',
    SETTINGS: 'wms_settings'
  };

  // ========== Helpers ==========
  function _get(key) {
    try { return JSON.parse(localStorage.getItem(key)) || []; }
    catch { return []; }
  }

  function _set(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  function _genId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 6);
  }

  function _today() {
    return new Date().toISOString().slice(0, 10);
  }

  function _daysUntil(dateStr) {
    if (!dateStr) return 0;
    const t = new Date(_today() + 'T00:00:00');
    const d = new Date(dateStr + 'T00:00:00');
    const diff = d - t;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  // ========== Generic CRUD ==========
  function _getAll(key) { return _get(key); }

  function _getById(key, id) {
    return _get(key).find(item => item.id === id) || null;
  }

  function _add(key, item) {
    const list = _get(key);
    item.id = _genId();
    item.createdAt = new Date().toISOString();
    list.push(item);
    _set(key, list);
    return item;
  }

  function _update(key, id, data) {
    const list = _get(key);
    const idx = list.findIndex(item => item.id === id);
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...data, updatedAt: new Date().toISOString() };
      _set(key, list);
      return list[idx];
    }
    return null;
  }

  function _remove(key, id) {
    const list = _get(key).filter(item => item.id !== id);
    _set(key, list);
  }

  // ========== Settings ==========
  function getSettings() {
    try {
      return JSON.parse(localStorage.getItem(KEYS.SETTINGS)) || {
        alertDays: 15,
        groupName: '大动物组'
      };
    } catch {
      return { alertDays: 15, groupName: '大动物组' };
    }
  }

  function saveSettings(s) {
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(s));
  }

  // ========== Warehouses ==========
  const warehouses = {
    getAll: () => _getAll(KEYS.WAREHOUSES),
    getById: (id) => _getById(KEYS.WAREHOUSES, id),
    add: (data) => _add(KEYS.WAREHOUSES, data),
    update: (id, data) => _update(KEYS.WAREHOUSES, id, data),
    remove: (id) => _remove(KEYS.WAREHOUSES, id)
  };

  // ========== Categories ==========
  const categories = {
    getAll: () => _getAll(KEYS.CATEGORIES),
    getById: (id) => _getById(KEYS.CATEGORIES, id),
    add: (data) => _add(KEYS.CATEGORIES, data),
    update: (id, data) => _update(KEYS.CATEGORIES, id, data),
    remove: (id) => _remove(KEYS.CATEGORIES, id)
  };

  // ========== Products ==========
  const products = {
    getAll: () => _getAll(KEYS.PRODUCTS),
    getById: (id) => _getById(KEYS.PRODUCTS, id),
    add: (data) => _add(KEYS.PRODUCTS, data),
    update: (id, data) => _update(KEYS.PRODUCTS, id, data),
    remove: (id) => _remove(KEYS.PRODUCTS, id),
    search(keyword) {
      const kw = (keyword || '').toLowerCase();
      return _getAll(KEYS.PRODUCTS).filter(p =>
        p.name.toLowerCase().includes(kw) ||
        (p.barcode && p.barcode.includes(kw))
      );
    },
    getByCategory(categoryId) {
      if (!categoryId) return _getAll(KEYS.PRODUCTS);
      return _getAll(KEYS.PRODUCTS).filter(p => p.categoryId === categoryId);
    }
  };

  // ========== Partners ==========
  const partners = {
    getAll: () => _getAll(KEYS.PARTNERS),
    getById: (id) => _getById(KEYS.PARTNERS, id),
    add: (data) => _add(KEYS.PARTNERS, data),
    update: (id, data) => _update(KEYS.PARTNERS, id, data),
    remove: (id) => _remove(KEYS.PARTNERS, id)
  };

  // ========== Stock In Orders ==========
  const stockIn = {
    getAll: () => _getAll(KEYS.STOCK_IN),
    getById: (id) => _getById(KEYS.STOCK_IN, id),
    add(data) {
      return _add(KEYS.STOCK_IN, data);
    },
    remove: (id) => _remove(KEYS.STOCK_IN, id),
    query(filters = {}) {
      let orders = _getAll(KEYS.STOCK_IN);
      if (filters.warehouseId) {
        orders = orders.filter(o => o.warehouseId === filters.warehouseId);
      }
      if (filters.operator) {
        orders = orders.filter(o => o.operator && o.operator.includes(filters.operator));
      }
      if (filters.startDate) {
        orders = orders.filter(o => o.date >= filters.startDate);
      }
      if (filters.endDate) {
        orders = orders.filter(o => o.date <= filters.endDate);
      }
      return orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
  };

  // ========== Stock Out Orders ==========
  const stockOut = {
    getAll: () => _getAll(KEYS.STOCK_OUT),
    getById: (id) => _getById(KEYS.STOCK_OUT, id),
    add(data) {
      return _add(KEYS.STOCK_OUT, data);
    },
    remove: (id) => _remove(KEYS.STOCK_OUT, id),
    query(filters = {}) {
      let orders = _getAll(KEYS.STOCK_OUT);
      if (filters.warehouseId) {
        orders = orders.filter(o => o.warehouseId === filters.warehouseId);
      }
      if (filters.operator) {
        orders = orders.filter(o => o.operator && o.operator.includes(filters.operator));
      }
      if (filters.startDate) {
        orders = orders.filter(o => o.date >= filters.startDate);
      }
      if (filters.endDate) {
        orders = orders.filter(o => o.date <= filters.endDate);
      }
      return orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
  };

  // ========== Inventory Calculation ==========
  function _calcInventory() {
    const inv = {};

    // 累加入库
    _getAll(KEYS.STOCK_IN).forEach(order => {
      (order.items || []).forEach(item => {
        const key = `${item.productId}__${order.warehouseId}`;
        if (!inv[key]) {
          inv[key] = {
            productId: item.productId,
            warehouseId: order.warehouseId,
            quantity: 0,
            totalCost: 0
          };
        }
        inv[key].quantity += Number(item.quantity) || 0;
        inv[key].totalCost += (Number(item.quantity) || 0) * (Number(item.price) || 0);
      });
    });

    // 扣减出库
    _getAll(KEYS.STOCK_OUT).forEach(order => {
      (order.items || []).forEach(item => {
        const key = `${item.productId}__${order.warehouseId}`;
        if (!inv[key]) {
          inv[key] = {
            productId: item.productId,
            warehouseId: order.warehouseId,
            quantity: 0,
            totalCost: 0
          };
        }
        inv[key].quantity -= Number(item.quantity) || 0;
        inv[key].totalCost -= (Number(item.quantity) || 0) * (Number(item.price) || 0);
      });
    });

    return Object.values(inv);
  }

  function getInventory(filters = {}) {
    let inv = _calcInventory();

    if (filters.warehouseId) {
      inv = inv.filter(i => i.warehouseId === filters.warehouseId);
    }
    if (filters.categoryId) {
      const pids = products.getByCategory(filters.categoryId).map(p => p.id);
      inv = inv.filter(i => pids.includes(i.productId));
    }
    if (filters.keyword) {
      const pids = products.search(filters.keyword).map(p => p.id);
      inv = inv.filter(i => pids.includes(i.productId));
    }
    if (!filters.showZero) {
      inv = inv.filter(i => i.quantity !== 0);
    }

    // 丰富商品信息
    return inv.map(i => {
      const product = products.getById(i.productId);
      const warehouse = warehouses.getById(i.warehouseId);
      const category = product ? categories.getById(product.categoryId) : null;
      return {
        ...i,
        productName: product ? product.name : '未知商品',
        productUnit: product ? (product.unit || '') : '',
        productBarcode: product ? (product.barcode || '') : '',
        categoryName: category ? category.name : '',
        warehouseName: warehouse ? warehouse.name : '',
        avgCost: i.quantity > 0 ? +(i.totalCost / i.quantity).toFixed(2) : 0,
        inventoryValue: +i.totalCost.toFixed(2),
        minStock: product ? (Number(product.minStock) || 0) : 0,
        expiryDate: product ? (product.expiryDate || '') : '',
        expiryDays: product && product.expiryDate ? _daysUntil(product.expiryDate) : 0,
        itemNo: product ? (product.itemNo || '') : '',
        manufacturer: product ? (product.manufacturer || '') : ''
      };
    });
  }

  // 获取某商品在各仓库的分布
  function getProductDistribution(productId) {
    return _calcInventory()
      .filter(i => i.productId === productId && i.quantity > 0)
      .map(i => {
        const wh = warehouses.getById(i.warehouseId);
        return { warehouseName: wh ? wh.name : '未知', quantity: i.quantity };
      });
  }

  // 库存预警（低于安全库存）
  function getStockAlerts(filters = {}) {
    return getInventory({ ...filters, showZero: true }).filter(i =>
      i.minStock > 0 && i.quantity <= i.minStock
    );
  }

  // 过期预警
  function getExpiryAlerts(filters = {}) {
    const alertDays = filters.alertDays || getSettings().alertDays || 15;
    return getInventory({ ...filters, showZero: false }).filter(i =>
      i.expiryDate && i.expiryDays <= alertDays
    );
  }

  // ========== 今日统计 ==========
  function getTodayStats() {
    const today = _today();
    const inOrders = _getAll(KEYS.STOCK_IN).filter(o => o.date === today);
    const outOrders = _getAll(KEYS.STOCK_OUT).filter(o => o.date === today);

    let inCount = inOrders.length;
    let inQty = 0;
    inOrders.forEach(o => (o.items || []).forEach(i => { inQty += Number(i.quantity) || 0; }));

    let outCount = outOrders.length;
    let outQty = 0;
    outOrders.forEach(o => (o.items || []).forEach(i => { outQty += Number(i.quantity) || 0; }));

    return { inCount, inQty, outCount, outQty };
  }

  // ========== 初始化演示数据 ==========
  function initDemo() {
    if (_getAll(KEYS.WAREHOUSES).length > 0) return;

    // 仓库
    const wh1 = _add(KEYS.WAREHOUSES, { name: '预留房间1' });

    // 分类
    const cat1 = _add(KEYS.CATEGORIES, { name: '消毒液类' });
    const cat2 = _add(KEYS.CATEGORIES, { name: '纱布卷胶带类' });
    const cat3 = _add(KEYS.CATEGORIES, { name: '静脉输液类' });
    const cat4 = _add(KEYS.CATEGORIES, { name: '电镐耗材' });
    const cat5 = _add(KEYS.CATEGORIES, { name: '超声耗材' });
    const cat6 = _add(KEYS.CATEGORIES, { name: '电刀耗材' });
    const cat7 = _add(KEYS.CATEGORIES, { name: '麻醉耗材' });

    // 商品
    const p1 = _add(KEYS.PRODUCTS, {
      name: '3%过氧化氢消毒液[500ml]',
      categoryId: cat1.id, unit: '瓶', barcode: '6901234567890',
      minStock: 50, expiryDate: '2027-05-28', spec: '500ml/瓶',
      itemNo: 'REF-3001', manufacturer: '医疗器械厂A'
    });
    const p2 = _add(KEYS.PRODUCTS, {
      name: '通用双插手术电缆笔',
      categoryId: cat6.id, unit: '箱', barcode: '6901234567891',
      minStock: 5, expiryDate: '', spec: '',
      itemNo: 'REF-3002', manufacturer: '医疗器械厂B'
    });
    const p3 = _add(KEYS.PRODUCTS, {
      name: '7312号电性碳双面胶带[12mm×20m 无纺布蓝色 卷芯]',
      categoryId: cat4.id, unit: '卷', barcode: '6901234567892',
      minStock: 3, expiryDate: '2028-05-28', spec: '12mm×20m',
      itemNo: 'REF-3003', manufacturer: '医疗器械厂C'
    });
    const p4 = _add(KEYS.PRODUCTS, {
      name: '7311号电性碳双面胶带[8mm×20m 无纺布蓝色 卷芯]',
      categoryId: cat4.id, unit: '卷', barcode: '6901234567893',
      minStock: 3, expiryDate: '2028-05-28', spec: '8mm×20m',
      itemNo: 'REF-3004', manufacturer: '医疗器械厂D'
    });

    // 往来单位
    const sup1 = _add(KEYS.PARTNERS, {
      name: '医疗器械供应商A', type: 'supplier',
      contact: '张经理', phone: '13800138001'
    });
    const sup2 = _add(KEYS.PARTNERS, {
      name: '医药公司B', type: 'supplier',
      contact: '李经理', phone: '13800138002'
    });

    // 入库单据
    const today = _today();
    _add(KEYS.STOCK_IN, {
      date: today, warehouseId: wh1.id, partnerId: sup1.id,
      type: '采购入库', remark: '', images: [],
      items: [{ productId: p1.id, quantity: 130, price: 0 }],
      operator: '管理员'
    });
    _add(KEYS.STOCK_IN, {
      date: today, warehouseId: wh1.id, partnerId: sup1.id,
      type: '采购入库', remark: '', images: [],
      items: [{ productId: p1.id, quantity: 120, price: 0 }],
      operator: '管理员'
    });
    _add(KEYS.STOCK_IN, {
      date: today, warehouseId: wh1.id, partnerId: sup2.id,
      type: '采购入库', remark: '', images: [],
      items: [{ productId: p1.id, quantity: 14, price: 0 }],
      operator: '管理员'
    });
    _add(KEYS.STOCK_IN, {
      date: today, warehouseId: wh1.id, partnerId: sup2.id,
      type: '采购入库', remark: '', images: [],
      items: [{ productId: p1.id, quantity: 30, price: 0 }],
      operator: '管理员'
    });
    _add(KEYS.STOCK_IN, {
      date: today, warehouseId: wh1.id, partnerId: sup1.id,
      type: '采购入库', remark: '', images: [],
      items: [{ productId: p2.id, quantity: 30, price: 0 }],
      operator: '管理员'
    });
    _add(KEYS.STOCK_IN, {
      date: today, warehouseId: wh1.id, partnerId: sup1.id,
      type: '采购入库', remark: '', images: [],
      items: [{ productId: p3.id, quantity: 5, price: 0 }],
      operator: '管理员'
    });
    _add(KEYS.STOCK_IN, {
      date: today, warehouseId: wh1.id, partnerId: sup2.id,
      type: '采购入库', remark: '', images: [],
      items: [{ productId: p4.id, quantity: 3, price: 0 }],
      operator: '管理员'
    });
    _add(KEYS.STOCK_IN, {
      date: today, warehouseId: wh1.id, partnerId: sup1.id,
      type: '采购入库', remark: '', images: [],
      items: [{ productId: p1.id, quantity: 600, price: 0 }],
      operator: '管理员'
    });

    // 出库单据
    _add(KEYS.STOCK_OUT, {
      date: today, warehouseId: wh1.id, partnerId: '',
      type: '销售出库', remark: '', images: [],
      items: [
        { productId: p1.id, quantity: 50, price: 0 },
        { productId: p2.id, quantity: 2, price: 0 }
      ],
      operator: '管理员'
    });
    _add(KEYS.STOCK_OUT, {
      date: today, warehouseId: wh1.id, partnerId: '',
      type: '领用出库', remark: '', images: [],
      items: [{ productId: p1.id, quantity: 20, price: 0 }],
      operator: '管理员'
    });
    _add(KEYS.STOCK_OUT, {
      date: today, warehouseId: wh1.id, partnerId: '',
      type: '销售出库', remark: '', images: [],
      items: [
        { productId: p3.id, quantity: 1, price: 0 },
        { productId: p1.id, quantity: 30, price: 0 }
      ],
      operator: '管理员'
    });
    _add(KEYS.STOCK_OUT, {
      date: today, warehouseId: wh1.id, partnerId: '',
      type: '销售出库', remark: '', images: [],
      items: [
        { productId: p1.id, quantity: 4, price: 0 },
        { productId: p4.id, quantity: 2, price: 0 }
      ],
      operator: '管理员'
    });
    _add(KEYS.STOCK_OUT, {
      date: today, warehouseId: wh1.id, partnerId: '',
      type: '领用出库', remark: '', images: [],
      items: [
        { productId: p2.id, quantity: 1, price: 0 }
      ],
      operator: '管理员'
    });
    _add(KEYS.STOCK_OUT, {
      date: today, warehouseId: wh1.id, partnerId: '',
      type: '销售出库', remark: '', images: [],
      items: [
        { productId: p1.id, quantity: 6, price: 0 }
      ],
      operator: '管理员'
    });
  }

  // ========== Public API ==========
  return {
    warehouses,
    categories,
    products,
    partners,
    stockIn,
    stockOut,
    getInventory,
    getProductDistribution,
    getStockAlerts,
    getExpiryAlerts,
    getTodayStats,
    getSettings,
    saveSettings,
    initDemo
  };
})();
