/**
 * 监听器
 */
import Dep from './dep'
let uid = 0;
class Watcher {
    constructor(data, name, callback) {
        this.uid = uid++;
        this.data = data;
        this.name = name; // 该名字为 name、data.obj 或 data.opt.aaa 等类似的类型
        this.oldVal = data[name];
        this.callback = callback;

        this.update();
    }
    // 获取新值
    get() {
        let nameArr = this.name.split('.');
        let newVal = this.data;
        // console.log('监视器中的名字：', this.name, nameArr);

        nameArr.forEach((item, index) => {
            // 当获取到最终值时，将其保存到 dep 中
            if (index === nameArr.length - 1) Dep.target = this;
            newVal = newVal[item];
        });
        Dep.target = null;

        return newVal
    }
    // 计算获取对应的值 
    compute() {
        console.log(value);
        return value; // 返回新值
    }
    // 进行更新
    update() {
        let newVal = this.get(); // 获取新值
        this.callback(newVal, this.oldVal);
    }
}

export default Watcher