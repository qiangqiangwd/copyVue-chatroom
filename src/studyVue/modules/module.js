/**
 * 模型层
 * 暂时只处理标签中的业务
 */
import $ from './mainFun';
import watcher from './watcher';
class moduleFloor {
    constructor(dom, data) {
        this.dom = dom;
        this.data = data;
    }
    /**
     * === 静态数据处理
     */
    // 循环 【 暂不支持 循环数字】
    forDataFun(attr) {
        attr = attr.trim(); // 先取出两边空格
        let dom = this.dom.cloneNode(true); // 克隆本身节点及其子节点
        let parentNode = this.dom.parentNode; // 其父节点
        parentNode.replaceChild(dom, this.dom); // 替换旧节点（后续方便统一处理）

        let loopOptArr = attr.split(/\s+in\s+/g); // 操作所需要的参数


        // 总的节点的数组（当发生改变时重置）
        this.loopDomOptions = {
            operateArr: [], // 操作的数组
        };
        // 设置监听器
        new watcher(this.data, loopOptArr[1], (changeArr, type) => {
            // console.log('数组设置的监听器返回的参数：', changeArr, type);
            this.loopDomOptions.operateArr = []; // 当数组发生变化时，重置需操作的内容
            for (let i = 0; i < changeArr.length; i++) {
                let value = changeArr[i]; // 获取其值
                if (type && typeof type !== 'string') { // 当 type 存在不为字符串即初始化
                    // 第一个节点为其本身
                    if (i === 0) {
                        // 初始化節點并重设节点
                        this.loopToSetValue(loopOptArr[0], dom, value);
                    } else {
                        this.cloneDomAndSetData(dom, loopOptArr, value, parentNode);
                    }
                } else if (type === 'push') {
                    this.cloneDomAndSetData(dom, loopOptArr, value, parentNode);
                }
            }
        });
        // 对非数组中的值但还是需要监听并赋值的处理
        this.loopIsNotArrData(loopOptArr[1], parentNode);
        // 移除最先的节点
        // parentNode.removeChild(dom);
    }
    // 对非数组中的值但还是需要监听并赋值的处理,
    // 参数名、所有的节点、父节点
    loopIsNotArrData(name, parentNode) {
        // console.log(this.data[name], this.loopDomOptions, parentNode);
        Object.keys(this.loopDomOptions).forEach(name => {
            // console.log(this.loopDomOptions);
            if (typeof this.loopDomOptions[name] === 'string') {
                // 设置其他参数的监听器
                new watcher(this.data, name, (newVal, oldVal) => {
                    this.loopDomOptions.operateArr.forEach(callback => {
                        callback(newVal, oldVal, name); // 调用回调函数
                    });
                });
            }
        });
    }
    // 循环时对节点 里的值进行设置（默认为 item）
    loopToSetValue(name, dom, value) {
        let childNode = dom.childNodes;
        if (childNode.length > 0) {
            Array.prototype.slice.call(childNode).forEach(node => {
                this.loopToSetValue(name, node, value);
            });
        }
        // 保证只为 {{item}} 或 {{item.name}} 的情况
        let nodeValue = $.setContentToArr(dom.nodeValue);

        if (nodeValue && typeof nodeValue !== 'string') {
            let reg = new RegExp(`^(${name}|${name}\.[a-z|A-Z|0-9|\_|\-]+)$`, 'g');
            // 重新设置值
            let newVal = '';
            nodeValue.forEach(item => {
                newVal += typeof item === 'string' ? item : (() => {
                    if (reg.test(item.name)) { // 若为 item 的值
                        let itemName = item.name.replace(name + '.', '');
                        return typeof value === 'object' ? value[itemName] : value
                    }
                    // 若未保存过需注意的参数
                    if (!this.loopDomOptions[item.name]) {
                        this.loopDomOptions[item.name] = item.name;
                    }
                    return $.getByEval(this.data, item.name);
                })();
            });
            // 设置值
            dom.nodeValue = newVal;

            this.loopDomOptions.operateArr.push((newV, oldV, changeName) => {
                // 先筛选 当前是否有符合该字段名字的，然后对应的进行更改
                // console.log(nodeValue, changeName, nodeValue.filter(r => r.name && r.name == changeName));
                if (nodeValue.filter(r => r.name && r.name == changeName).length > 0) {
                    let reg = new RegExp(`^(${name}|${name}\.[a-z|A-Z|0-9|\_|\-]+)$`, 'g');
                    let newVal = '';
                    nodeValue.forEach(item => {
                        newVal += typeof item === 'string' ? item : (() => {
                            if (reg.test(item.name)) { // 若为 item 的值
                                let itemName = item.name.replace(name + '.', '');
                                return typeof value === 'object' ? value[itemName] : value
                            }

                            return newV;
                        })();
                    });
                    // 设置值
                    dom.nodeValue = newVal;
                }
            });
        }
    }
    // 克隆节点并渲染数据然后再存放
    cloneDomAndSetData(dom, loopOptArr, value, parentNode) {
        // 克隆该节点，参数设置为 true，克隆节点及其属性，以及后代；设置为 false，克隆节点本身
        let cloneDom = this.dom.cloneNode(true);
        // 设置节点内存在的参数
        this.loopToSetValue(loopOptArr[0], cloneDom, value);
        // insertBefore（a, b）是参照节点，意思是a节点会插入b节点的前面
        parentNode.appendChild(cloneDom, dom);//在 dom 节点前插入克隆的元素节点
    }

    /**
     * === 添加方法部分
     */
    addMethod(method, funName) {
        let _this = this;
        funName = funName.replace(/\s|\n|\b/g, ''); // 清除所有空格换行
        let reg = /\(((?!\)).)*\)/g;
        let param = null; // 参数
        if (reg.test(funName)) {
            param = funName.slice(funName.indexOf('(') + 1, -1);
            funName = funName.replace(reg, '');
        }
        this.dom.addEventListener(method, function () {
            if (!_this.data[funName]) {
                console.error(`未定义的方法：${funName}`);
                return
            }
            _this.data[funName].bind(_this.data)(_this.data[param] || param);
        });
    }
}

export default moduleFloor