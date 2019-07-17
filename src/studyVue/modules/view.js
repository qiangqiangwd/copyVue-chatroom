/**
 * 视图层
 */
import watcher from './watcher' // 监听器
import moduleFloor from './module' // 模型层
import $ from './mainFun' // 公共参数

class View {
    constructor(id = '#app', data) {
        this.el = document.querySelector(id);
        this.data = data; // 保存数据

        this.loopGetDom(this.el); // 循环获取所有节点元素
    }
    // 这里先对本身节点进行操作后再去循环子节点
    loopGetDom(dom) {
        // 根据对应节点进行对应的操作 1 - 标签节点、3 - 文字节点
        switch (dom.nodeType) {
            case 1:
                new moduleFloor(dom,this.data); // 进入模型层

                // 对 输入框 进行双向数据绑定
                if (dom.nodeName === 'INPUT' || dom.nodeName === 'TEXTAREA') {
                    this.twoWayBind(dom);
                }
                break
            case 3:
                let txt = dom.nodeValue.trim(); // 去除空格、换行空白符号
                if (txt) { // 若文字不为空
                    // let txtReg = /{{((?!}}).)*}}/g; // 在 {{}} 中不包含 }} 的
                    let txtReg = /\{\{[a-z|A-Z|0-9|\+|\-|\*|\/|\.|\(|\)|\r|\n|\s]+\}\}/g; // 在 {{}} 中不包含 }} 的
                    let txtOpt = txt.match(txtReg); // 含有参数（{{}} 内的）的内容
                    if (txtOpt) {
                        let txtOth = txt.split(txtReg); // 其他内容
                        let totalArr = [txtOth[0]]; // 上面两个合并后的数组
                        // 计算出最终的值
                        let mergeStr = (arr) => {
                            let totalStr = '';
                            arr.forEach((item, index) => {
                                totalStr += typeof item === 'string' ? (arr[index + 1] ? item + '{{' : item) : (() => {
                                    let isStr = (typeof arr[index + 1] !== 'object') // 下一个不为对象时
                                    // 对当前值 进行一下转换操作
                                    let val = typeof item.value === 'string' ? '"' + item.value + '"' :
                                        (typeof item.value === 'object' ? '"[object Object]"' : item.value);

                                    return val + item.type + (isStr ? '}}' : '')
                                })();
                            });

                            // 替换换算后的值
                            totalStr = totalStr.replace(/{{((?!}}).)*}}/g, str => {
                                str = str.slice(2, -2); // 获取完整的内容
                                // 进行计算，若出错则返回原字符串
                                try {
                                    return eval(str);
                                } catch (err) {
                                    return str;
                                }
                            });
                            return totalStr
                        };

                        txtOpt.forEach((item, index) => {
                            let name = item.slice(2, -2).replace(/[\r|\n|\s]/g, ""); // 参数名字（去除参数所有的空格和换行）

                            // 先存放参数中数据
                            let setDataArr = this.getValueByName(name);
                            setDataArr.forEach(data => {
                                totalArr.push(data);

                                //  设置监听器
                                let posIndex = totalArr.length - 1; // 参数当前位置
                                // console.log('设置watcher时',dom,data.name);
                                new watcher(this.data, data.name, (newVal, oldVal) => {
                                    totalArr[posIndex].value = newVal; // 设置新值
                                    dom.nodeValue = mergeStr(totalArr); // 改变值
                                });
                            });

                            // 其他相关数据
                            totalArr.push(txtOth[index + 1]);
                        });
                    }
                }
                break
        }

        let childNode = dom.childNodes;
        if (childNode.length > 0) { // 若包含子节点，循环子节点
            Array.prototype.slice.call(childNode).forEach(node => {
                this.loopGetDom(node);
            });
        }
    }
    // 判断数据中是否含有 + - * / , 对操作进行数据划分
    getValueByName(name) {
        let reg1 = /[\+|\-|\*|\/]/g; // 检测是否含有其他操作
        let resArr = [];

        if (reg1.test(name)) { // 含有操作  1 + 2 + 6
            let MathOpt = name.split(reg1); // 1 2 6
            let MathIcon = name.match(reg1); // + +
            MathOpt.forEach((item, index) => {
                resArr.push({
                    name: item,
                    type: MathIcon[index] ? MathIcon[index] : '',
                });
            });
        } else {
            resArr.push({
                name: name,
                type: '',
            });
        }

        return resArr
    }

    // 双向数据绑定
    twoWayBind(dom) {
        let model = dom.getAttribute('v-model');
        if (model) {
            dom.removeAttribute('v-model'); // 移除 v-model 属性
            let _this = this;
            dom.addEventListener('input', (e) => {
                // 利用 eval 动态赋值
                $.setByEval(_this.data, model, dom.value);
            });

            new watcher(this.data, model, (newVal, oldVal) => {
                dom.value = newVal; // 改变值
            });
        }
    }
}

export default View