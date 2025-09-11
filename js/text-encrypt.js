/************************
*
*    文本加密解密
*
**************************/

 // 文本加密解密功能
 function processText() {
    const text = document.getElementById('textInput').value;
    const key = document.getElementById('encryptionKey').value;
    const operation = document.getElementById('operation').value;

    if (!text) {
        alert('请输入文本');
        return;
    }

    if (!key) {
        alert('请输入加密密钥');
        return;
    }

    let result = '';

    if (operation === 'encrypt') {
        result = encryptText(text, key);
    } else {
        try {
            result = decryptText(text, key);
        } catch (e) {
            alert('解密失败，请检查密钥是否正确');
            return;
        }
    }

    document.getElementById('textResult').style.display = 'block';
    document.getElementById('resultText').value = result;

    const downloadLink = document.getElementById('downloadText');
    const blob = new Blob([result], { type: 'text/plain' });
    downloadLink.href = URL.createObjectURL(blob);
}

// 文本加密函数
function encryptText(text, key) {
    // 简单加密算法实现
    let result = '';
    for (let i = 0; i < text.length; i++) {
        const charCode = text.charCodeAt(i);
        const keyChar = key.charCodeAt(i % key.length);
        const encryptedChar = charCode ^ keyChar;
        result += String.fromCharCode(encryptedChar);
    }
    return btoa(result); // Base64编码
}

// 文本解密函数
function decryptText(text, key) {
    // Base64解码
    const decoded = atob(text);
    let result = '';
    for (let i = 0; i < decoded.length; i++) {
        const charCode = decoded.charCodeAt(i);
        const keyChar = key.charCodeAt(i % key.length);
        const decryptedChar = charCode ^ keyChar;
        result += String.fromCharCode(decryptedChar);
    }
    return result;
}
