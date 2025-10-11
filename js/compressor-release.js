/************************
*
*    压缩器释放时间计算器
*
**************************/

// 压缩释放时间计算函数
function calculateCompressorRelease() {
    const bpmInput = document.getElementById('bpmInput');
    const bpm = parseFloat(bpmInput.value);

    // 验证BPM值
    if (!bpm || bpm < 1 || bpm > 300) {
        alert('请输入有效的BPM值（1-300之间）');
        bpmInput.focus();
        return;
    }


    // 计算各种乐器的释放时间（基于BPM）
    const kickRelease = calculateValues2(bpm, 50);
    const snareRelease = calculateValues2(bpm, 150);
    const tomRelease = calculateValues2(bpm, 250);
    const bassRelease = calculateValues2(bpm, 50);
    const slapBassRelease = calculateValues2(bpm, 80);
    const vocalRelease = calculateValues2(bpm, 100);
    const AGuitarRelease = calculateValues2(bpm, 150);
    const EGuitarRelease = calculateValues2(bpm, 120);
    const pianoRelease = calculateValues2(bpm, 300);
    const EPianoRelease = calculateValues2(bpm, 200);
    const stringsRelease = calculateValues2(bpm, 500);
    const windRelease = calculateValues2(bpm, 200);
    const chineseKickRelease = calculateValues2(bpm, 300);
    const erhuKickRelease = calculateValues2(bpm, 200);
    const diziRelease = calculateValues2(bpm, 120);
    const guzhengRelease = calculateValues2(bpm, 250);
    const guqinRelease = calculateValues2(bpm, 800);

    //先清空容器数据
    document.getElementById('resultContainer').innerHTML = ''

    // 显示结果区域
    document.getElementById('compressorResult').style.display = 'block';

    // 创建下载链接
    const downloadLink = document.getElementById('downloadCompressorResult');
    const resultText = `压缩释放时间计算结果 (基于 ${bpm} BPM):
    
 ${updateDisplay2('底鼓', 'kickRelease', kickRelease, 'ms', '建议范围: 20-200ms')}  
 ${updateDisplay2('军鼓', 'snareRelease', snareRelease, 'ms', '建议范围: 50-300ms')} 
 ${updateDisplay2('通鼓', 'tomRelease', tomRelease, 'ms', '建议范围: 100-500ms')} 
 ${updateDisplay2('贝斯(指弹)', 'bassRelease', bassRelease, 'ms', '建议范围: 20-200ms')} 
 ${updateDisplay2('贝斯(slap)', 'slapBassRelease', slapBassRelease, 'ms', '建议范围: 50-150ms')} 
 ${updateDisplay2('人声', 'vocalRelease', vocalRelease, 'ms', '建议范围: 50-300ms')}  
 ${updateDisplay2('原声吉他', 'AGuitarRelease', AGuitarRelease, 'ms', '建议范围: 50-300ms')} 
 ${updateDisplay2('电吉他', 'EGuitarRelease', EGuitarRelease, 'ms', '建议范围: 40-250ms')}  
 ${updateDisplay2('原声钢琴', 'pianoRelease', pianoRelease, 'ms', '建议范围: 100-1000ms')} 
 ${updateDisplay2('电钢琴', 'EPianoRelease', EPianoRelease, 'ms', '建议范围: 50-400ms')}  
 ${updateDisplay2('弦乐队(合奏)', 'stringsRelease', stringsRelease, 'ms', '建议范围: 50-400ms')} 
 ${updateDisplay2('管乐(萨克斯/小号)', 'windRelease', windRelease, 'ms', '建议范围: 100-500ms')} 
 ${updateDisplay2('大鼓/堂鼓', 'chineseKickRelease', chineseKickRelease, 'ms', '建议范围: 100-600ms')} 
 ${updateDisplay2('二胡', 'erhuKickRelease', erhuKickRelease, 'ms', '建议范围: 100-500ms')} 
 ${updateDisplay2('笛子/萧', 'diziRelease', diziRelease, 'ms', '建议范围: 50-300ms')} 
 ${updateDisplay2('古筝/琵琶', 'guzhengRelease', guzhengRelease, 'ms', '建议范围: 100-400ms')} 
 ${updateDisplay2('古琴', 'guqinRelease', guqinRelease, 'ms', '建议范围: 300-1000ms')} 
    `;
    const blob = new Blob([resultText], { type: 'text/plain' });
    downloadLink.href = URL.createObjectURL(blob);
}


// 更新显示结果
function updateDisplay2(name, elementId, values, unit, mark) {
    const resultContainer = document.getElementById('resultContainer');
    let output = 0;
    // 添加所有值
    if (values.length > 1) {
        /*    values.forEach(item => {
               element.textContent += ',' + item.value;
           }); */
        output = values[1] || 0

    } else {
        output = values[0] || 0;
    }

    output = parseFloat(output.toFixed(2))
    output += unit

    const item = ` <div class="result-item">
    <div class="label">${name}</div>
    <div class="value" id="${elementId}">${output}</div>
    <div class="note">${mark}</div>
</div>`
    // 添加到容器中
    // resultContainer.appendChild(item);
    resultContainer.insertAdjacentHTML('beforeend', item);
    return `${name}:${output}  (${mark})`
}
/*  */


// 计算最接近参考值的
function calculateValues2(bpm, referenceValue) {

    // 计算64分音符的时长（毫秒）
    const value = 60000 / (bpm * 64);
    const epsilon = 1e-10; // 用于处理浮点精度误差

    // 直接处理value等于referenceValue的情况
    if (Math.abs(value - referenceValue) < epsilon) {
        return [value];
    }

    // 计算参考值对应的倍数（考虑浮点精度）
    const n = Math.floor((referenceValue + epsilon) / value);
    const candidate1 = n * value;
    const candidate2 = (n + 1) * value;

    // 处理candidate1可能为0或负值的情况
    if (candidate1 <= 0) {
        return [candidate2]; // 只返回大于0的candidate2
    }

    // 检查是否正好等于参考值
    if (Math.abs(candidate1 - referenceValue) < epsilon) {
        return [candidate1];
    }
    if (Math.abs(candidate2 - referenceValue) < epsilon) {
        return [candidate2];
    }

    // 返回最接近的两个值（确保candidate1 < referenceValue < candidate2）
    return [candidate1, candidate2];
}