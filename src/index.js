import './css/style.less'; // 引入整体样式

import CQvue from './studyVue/index';

const ChartRoom = new CQvue({
    id: '#chartRoom',
    data:{
        content:'内容内容1',
        title:'标题',
        name:'888',
        opt:{
            num1:'11',
            num2:'33',
            num3:'66',
            testObj:{
                aaaa:'aaaa'
            }
        },
        // arr:[],
    }
});

// ChartRoom.arr.push(...[33, 44]);
// ChartRoom.arr = [33,44];
// ChartRoom.arr.splice(1, 1, 55);
window.ChartRoom = ChartRoom;