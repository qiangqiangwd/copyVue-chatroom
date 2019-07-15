/**
 * 保存所有监听器的仓库
 * 当有值发生改变时对应的进行改变
 */

class Dep {
    constructor() {
        this.dependences = []; // 依赖列表
    }
    // 添加依赖（监听器） 
    addDep(watcher) {
        if (watcher) {
            this.dependences.push(watcher);
        }
    }
    // 通知并进行更新
    notify(newVal, oldVal, pName) {
        this.dependences.forEach(item => {
            console.log(item, pName);
            if (item.name === pName) {
                item.callback && item.callback(newVal, oldVal);
            }
        });
    }
    // // 检测是否含有重复的 watcher 
    // dependences(){}
}

export default Dep