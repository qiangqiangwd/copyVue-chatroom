import './css/style.less'; // 引入整体样式

import CQvue from './studyVue/index';

const ChartRoom = new CQvue({
    id: '#chartRoom',
    data: {
        msg: '消息内容',
        arr: [
            {
                name: 'cqq',
                id: 1,
                msg:'66666'
            },
        ],
    },
    methods:{
        sendMsg(){
            console.log('发送消息', this.msg)
        }
    }
});

// ChartRoom.arr.push(...[33, 44]);
// ChartRoom.arr = [33,44];
// ChartRoom.arr.splice(1, 1, 55);
window.ChartRoom = ChartRoom;