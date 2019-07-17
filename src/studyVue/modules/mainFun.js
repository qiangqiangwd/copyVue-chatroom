// 存放公共函数的地方

const mainFun = {
    // 利用 eval 动态获取对象的值
    // opt.name 等参数
    getByEval(data, name) {
        let evalFun = this._getDataByName(name);
        try {
            return eval(evalFun)
        } catch (err) { // 若发生错误直接返回原本名字（无效的参数）
            return name
        }
        // 尝试过用 new Function 的方式写，但有限制，不适合
        // (new Function(`ChartRoom${'["' + modelArr.join('"]["') + '"]'}="${dom.value}"`))();
    },
    setByEval(data, name, value) {
        value = typeof value === 'string' ? `"${value}"` : value;
        let evalFun = this._getDataByName(name) + '=' + value;
        eval(evalFun);
    },
    // 生成要执行代码的 字符串
    _getDataByName(name) {
        let nameArr = name.split('.');
        return `data${'["' + nameArr.join('"]["') + '"]'}`
    },

    /**
     * 对内容的一些操作
     */
    // 将其转化为数组，第二个参数为另外添加的筛选条件
    setContentToArr(str,othSelect) {
        let reg = /\{\{[a-z|A-Z|0-9|\+|\-|\*|\/|\.|\(|\)|\r|\n|\s]+\}\}/g;
        if (!(reg.test(str) && !(othSelect && !othSelect(str)))) return str

        // str = str.slice(2, -2).replace(/[\r|\n|\s]/g, "");
        let othArr = str.split(reg); // 内容数组
        let dataArr = str.match(reg); // 需操作的数组
        dataArr.forEach((item, index) => {
            othArr.splice(index * 2 + 1, 0, {
                name: item.slice(2, -2).replace(/[\r|\n|\s]/g, "") // 获取值并去里面的空格操作
            });
        });
        return othArr
    }
};

export default mainFun