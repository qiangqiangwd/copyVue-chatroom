/**
 * 模仿 vue 原理所写的框架
 * 首先说明，这只是个人练习作品，不多考虑兼容等问题，只为学习思路
 * 有很多功能是按照自己的理解来做的，和vue不完全一样
 */

import Controller from './modules/controller' // 控制器
import view from './modules/view' // 视图层

class CQvue {
    constructor(options = {}) {
        // 先对设置的数据进行监听
        // 后续再在 this 中添加参数时就不会监听到
        this.data = options.data;
        if (options.data && typeof options.data === 'object') {
            // 这里只监听 data 中和设置在 this中的data 参数
            // 将 data 参数放入 this 中
            Object.keys(options.data).forEach(name => {
                this[name] = options.data[name];
            });
            new Controller(this);
        }
        

        // 渲染视图层
        this.view = new view(options.id, this.data);
    }
}

export default CQvue