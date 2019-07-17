/**
 * 监听器
 */
import Dep from './dep';
import $ from './mainFun' // 公共参数
// let uid = 0;
class Watcher {
    constructor(data, name, callback) {
        // this.uid = uid++;
        this.data = data;
        this.name = name; // 该名字为 name、data.obj 或 data.opt.aaa 等类似的类型
        this.oldVal = data[name];
        this.callback = callback;

        this.update();
    }
    // 获取新值
    get() {
        Dep.target = this;
        let newVal = $.getByEval(this.data, this.name);
        Dep.target = null;

        return newVal
    }
    // // 计算获取对应的值 
    // compute() {
    //     return value; // 返回新值
    // }
    // 进行更新
    update() {
        let newVal = this.get(); // 获取新值
        this.callback(newVal, this.oldVal);
    }
}

export default Watcher