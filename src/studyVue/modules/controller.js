/**
 * 核心的 控制层 
 */
import Dep from './dep'

class Controller {
    constructor(data) {
        if (typeof data === 'object') {
            this.dep = new Dep();
            // 循环设置想要监听的值
            this.walk(data);
        }
    }
    // 数据，对象父级的名字
    walk(data, pName = null) {
        // 获取对象所有字段名
        Object.keys(data).forEach(name => {
            this.runner(data, name, data[name], (pName ? pName + '.' + name : name));
        });
    }
    // 监听数据的变化并进行提示
    // 参数：当前数据、数据名、数据的值
    runner(data, name, value, pName) {
        if (typeof value === 'object') {
            if (Array.isArray(value)) {
                // 将我们要监听的数组的原型指针指向自定义的空数组对象
                // 先暂时只能监听到一级层次内的数组
                value.__proto__ = this.arrayMethods();
                return
            }
            this.walk(value, pName);
        }

        let _this = this;
        Object.defineProperty(data, name, {
            get() {
                let watcher = Dep.target;
                if (watcher && !_this.dep.dependences[watcher.uid]) {
                    _this.dep.addDep(watcher); // 保存当前监听器
                    console.log('控制器中保存的名', pName, watcher.name);
                }

                return value
            },
            set(newVal) {
                if (newVal === value) return // 两个值一致则不执行下面方法
                // console.log('新值：', data, newVal, name, _this.dep, pName);
                // 新值、旧值、名称
                _this.dep.notify(newVal, value, pName);
                value = newVal;
            },
        });
    }
    // 监听数组的变化
    // 对 data 中存在的数组进行监听
    arrayMethods() {
        const arrayAugmentations = [];
        ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'].forEach(method => {
            // 获取原生 Array 的原型方法
            let original = Array.prototype[method];

            // 将 push、pop 等方法封装好的方法定义在对象 arrayAugmentations 属性上
            arrayAugmentations[method] = function () {
                console.log('数组发生改变！', arguments);
                return original.apply(this, arguments);
            }
        });
        // let list = ['a', 'b', 'c'];
        // // 将我们要监听的数组的原型指针指向上面定义的空数组对象
        // // 别忘了这个空数组的属性上定义了我们封装好的push等方法
        // list.__proto__ = arrayAugmentations;
        return arrayAugmentations;
    }
}

export default Controller