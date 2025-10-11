/************************
*
*    混响时间计算器
*
**************************/


// 混响时间计算函数
function calculateReverbTimes() {
    const bpmInput = document.getElementById('bpmInput');
    const bpm = parseFloat(bpmInput.value);

    // 验证BPM值
    if (!bpm || bpm < 1 || bpm > 300) {
        alert('请输入有效的BPM值（1-300之间）');
        bpmInput.focus();
        return;
    }


    // 计算各种混响的预延迟（基于BPM）
    // 房间混响：0-10ms范围
    const roomPreDelayValues = calculateValues(bpm, 0, 10);

    // 板式混响：10-30ms范围
    const platePreDelayValues = calculateValues(bpm, 10, 30);

    // 厅堂混响：20-40ms范围
    const hallPreDelayValues = calculateValues(bpm, 20, 40);

    // 计算衰减时间（基于音符时间）
    const roomDecayValues = calculateValues(bpm, 400, 1000);
    const plateDecayValues = calculateValues(bpm, 1500, 2500);
    const hallDecayValues = calculateValues(bpm, 2000, 4000);


    // 显示结果区域
    document.getElementById('reverbResult').style.display = 'block';
    // 创建下载链接
    const downloadLink = document.getElementById('downloadReverbResult');
    const resultText = `混响时间计算结果 (基于 ${bpm} BPM):
            
房间混响:
  发送量: -15 至 -20 dB
  预延迟: ${ updateDisplay('roomPreDelay', roomPreDelayValues, 'ms')}  (参考范围: 0-10 ms)
  衰减时间: ${updateDisplay('roomDecay', roomDecayValues, '秒')}  (参考范围: 0.4-1.0 秒)
  备注: 增加真实感，发送量要小到"几乎听不见但能感觉到"

板式混响:
  发送量: 0 dB
  预延迟: ${ updateDisplay('platePreDelay', platePreDelayValues, 'ms')}  (参考范围: 10-30 ms)
  衰减时间: ${updateDisplay('plateDecay', plateDecayValues, '秒')}  (参考范围: 1.5-2.5 秒)
  备注: 最主要的混响，发送量最大

厅堂混响:
  发送量: -8 至 -12 dB
  预延迟: ${updateDisplay('hallPreDelay', hallPreDelayValues, 'ms')}  (参考范围: 20-40 ms)
  衰减时间: ${updateDisplay('hallDecay', hallDecayValues, '秒')}  (参考范围: 2.0-4.0 秒)
  备注: 营造空间氛围感，适用于大型空间如音乐厅、教堂等，能提供丰富的空间感和深度
            `;
    const blob = new Blob([resultText], { type: 'text/plain' });
    downloadLink.href = URL.createObjectURL(blob);
}

// 更新显示结果
function updateDisplay(elementId, values, unit) {
    const element = document.getElementById(elementId);
    let output = 0;
    // 添加所有值
    if (values.length > 1) {
        /*    values.forEach(item => {
               element.textContent += ',' + item.value;
           }); */
        if (unit === '秒') {
            output = values[1].value / 1000
        } else {
            output = values[1].value
        }

    } else {
        if (unit === '秒') {
            output = (values[0]?.value || 1000) / 1000
        } else {
            output = values[0]?.value || 0;
        }
    }
    element.textContent = parseFloat(output.toFixed(2))
    element.textContent += unit

    return element.textContent
}


// 计算所有符合参考范围的值
function calculateValues(bpm, min, max) {
    const values = [];
    // 计算初始值（64分音符）
    let value = 60000 / (bpm * 64); // 转换为毫秒

    // 如果初始值大于最大值，则不断除以2直到在范围内
    while (value > max) {
        value /= 2;
    }

    // 如果初始值小于最小值，则不断乘以2直到在范围内
    while (value < min) {
        value *= 2;
    }
    // 通过2的倍数不断乘来检测范围内的值
    while (value <= max) {
        if (value >= min) {
            values.push({
                value: parseFloat(value.toFixed(2))
            });
        }
        
        value *= 2;
    }
   

    return values;
}



// 页面加载时自动计算
document.addEventListener('DOMContentLoaded', function () {
    calculateReverbTimes();
});
