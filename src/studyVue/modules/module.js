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

        //  对标签的属性进行解析
        this.labelAttrAnalyze();
    }
    labelAttrAnalyze() {
        let attrArr = ['v-for', 'key',];

        attrArr.forEach((item, index) => {
            let attr = this.dom.getAttribute(item);
            if (attr) {
                this.dom.removeAttribute(item); // 删除该属性，不在显示
                index == 0 && this.loopElem(attr);
            }
        });
    }
    // 循环 【 暂不支持 循环数字】
    loopElem(attr) {
        attr = attr.trim(); // 先取出两边空格
        let dom = this.dom.cloneNode(true); // 克隆本身节点及其子节点
        let parentNode = this.dom.parentNode; // 其父节点
        parentNode.replaceChild(dom, this.dom); // 替换旧节点（后续方便统一处理）

        let loopOptArr = attr.split(/\s+in\s+/g); // 操作所需要的参数
        // let dataArr = $.getByEval(this.data, loopOptArr[1]); // 获取需要循环的数组

        // 设置监听器
        new watcher(this.data, loopOptArr[1], (newVal, oldVal) => {
            this.loopDomArray = []; // 总的节点的数组（当发生改变时重置）
            console.log(newVal);
            // console.log('数组设置的监听器',newVal);
            for (let i = 0; i < newVal.length; i++) {
                let value = newVal[i]; // 获取其值
                this.loopDomArray.push([]); // 将其按。。。分类
                // 最后一个节点为其本身
                if (i == newVal.length - 1) {
                    // 初始化節點并重设节点
                    this.loopToSetValue(loopOptArr[0], dom, value, i);
                    break
                }
                // 克隆该节点，参数设置为 true，克隆节点及其属性，以及后代；设置为 false，克隆节点本身
                let cloneDom = this.dom.cloneNode(true);
                // 初始化節點并重设节点
                this.loopToSetValue(loopOptArr[0], cloneDom, value, i);
                // insertBefore（a, b）是参照节点，意思是a节点会插入b节点的前面
                parentNode.insertBefore(cloneDom, dom);//在 dom 节点前插入克隆的元素节点
            }
        });
        // console.log(this.loopDomArray);

        // 对非数组中的值但还是需要监听并赋值的处理
        // this.loopIsNotArrData(dataArr, loopDomArray, parentNode);
        // 移除最先的节点
        // parentNode.removeChild(dom);
    }
    // 对非数组中的值但还是需要监听并赋值的处理,
    // 总的参数、所有的节点、父节点
    loopIsNotArrData(dataArr, loopDomArray, parentNode) {
        console.log(dataArr, loopDomArray, parentNode);
    }
    // 循环时对节点 里的值进行设置（默认为 item）
    loopToSetValue(name, dom, value, i) {
        let childNode = dom.childNodes;
        if (childNode.length > 0) {
            Array.prototype.slice.call(childNode).forEach(node => {
                this.loopToSetValue(name, node, value, i);
            });
        }
        let reg = new RegExp(`^(${name}|${name}\.[a-z|A-Z|0-9|_]+)$`, 'g');
        // 保证只为 {{item}} 或 {{item.name}} 的情况
        let nodeValue = $.setContentToArr(dom.nodeValue);

        if (nodeValue && typeof nodeValue !== 'string') {
            let resDomDataArr = {
                dom: dom,
                arr: []
            };
            // 先进行保存
            resDomDataArr.arr.push(nodeValue);
            // 重新设置值
            let newVal = '';
            nodeValue.forEach(item => {
                newVal += typeof item === 'string' ? item : (() => {
                    if (reg.test(item.name)) { // 若为 item 的值
                        let itemName = item.name.replace(name + '.', '');
                        return typeof value === 'object' ? value[itemName] : value
                    }

                    return $.getByEval(this.data, item.name)
                })();
            });
            // 设置值
            dom.nodeValue = newVal;
            this.loopDomArray[i].push(resDomDataArr);
        }
    }
}

export default moduleFloor