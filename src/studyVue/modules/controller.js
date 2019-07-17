/**
 * 核心的 控制层 
 */
import Dep from './dep'

let uid = 0;
class Controller {
    constructor(data) {
        if (typeof data === 'object') {
            this.dep = new Dep();
            // 循环设置想要监听的值
            this.walk(data);
        }
    }
    // 数据，对象父级的名字
    walk(data) {
        // 获取对象所有字段名
        Object.keys(data).forEach(name => {
            this.runner(data, name, data[name], uid++);
        });
    }
    // 监听数据的变化并进行提示
    // 参数：当前数据、数据名、数据的值
    runner(data, name, value, uid) {
        if (typeof value === 'object') {
            if (Array.isArray(value)) {
                // 将我们要监听的数组的原型指针指向自定义的空数组对象
                // 先暂时只能监听到一级层次内的数组
                value.__proto__ = this.arrayMethods(JSON.parse(JSON.stringify(value)), uid);
            }
            this.walk(value);
        }

        let _this = this;
        Object.defineProperty(data, name, {
            get() {
                let watcher = Dep.target;
                // 存在监听器
                // && !(_this.dep.dependences.filter(r => r.uid === uid).length > 0)
                if (watcher) {
                    watcher.uid = uid; // 保存当前的唯一标识
                    _this.dep.addDep(watcher); // 保存当前监听器
                }

                // console.log('get进行获取', uid, name);
                return value
            },
            set(newVal) {
                if (newVal === value) return // 两个值一致则不执行下面方法
                // console.log('新值：', data, newVal, name, _this.dep, pName);
                // 新值、旧值、名称
                _this.dep.notify(newVal, value, uid);
                value = newVal;
            },
        });
    }
    // 监听数组的变化
    // 对 data 中存在的数组进行监听
    arrayMethods(arr, uid) {
        const arrayAugmentations = [];
        let _this = this;
        ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'].forEach(method => {
            // 获取原生 Array 的原型方法
            let original = Array.prototype[method];

            // 将 push、pop 等方法封装好的方法定义在对象 arrayAugmentations 属性上
            arrayAugmentations[method] = function () {
                let newArr = arr;
                // 当为添加时
                if (method === 'push') {
                    Array.prototype.slice.call(arguments).forEach(item => {
                        newArr.push(item);
                    });
                    console.log('数组发生改变！', arr, uid);
                }
                // 通知更新
                _this.dep.notify(newArr, arr, uid);
                // 通知更新后更新当前数据
                arr = newArr; 

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