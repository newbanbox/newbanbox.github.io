/************************
*
*    模态框
*
**************************/

// 全局变量
let currentTool = null;
let needShowModal = true;

// 打开工具模态框
function openTool(toolType) {
    currentTool = toolType;
    const modal = document.getElementById('toolModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');

    // 根据工具类型设置模态框内容和标题
    switch (toolType) {
        case 'musicRelease':
            needShowModal = false
            //跳转到二级页面
            // window.location.assign("./pages/music-release.html");
            window.open("./pages/music-release.html", '_blank');
            break;
        case 'imageToWord':
            modalTitle.textContent = '图片转Word工具';
            modalBody.innerHTML = `
                <div class="form-group">
                    <label for="imageUpload">上传图片</label>
                    <input type="file" id="imageUpload" accept="image/*">
                </div>
                <div class="form-group">
                    <label for="outputFormat">输出格式</label>
                    <select id="outputFormat">
                        <option value="docx">DOCX (Word文档)</option>
                        <option value="pdf">PDF</option>
                        <option value="txt">纯文本</option>
                    </select>
                </div>
                <div class="form-actions">
                    <button class="btn btn-secondary" onclick="closeModal()">取消</button>
                    <button class="btn btn-primary" onclick="processImage()">转换</button>
                </div>
                <div class="loading" id="ocrLoading" style="display: none;">
                    <div class="spinner"></div>
                    <p>正在识别图片中的文字...</p>
                    <div class="progress-container">
                        <div class="progress-bar" id="ocrProgress"></div>
                    </div>
                </div>
                <div id="imageToWordResult" class="result-container" style="display: none;">
                    <h3>转换结果</h3>
                    <div id="textPreview" style="margin: 15px 0; padding: 10px; border: 1px solid #ddd; border-radius: 5px; max-height: 200px; overflow-y: auto;"></div>
                    <a id="downloadText" class="download-btn" href="#" download="extracted_text.txt">下载文本</a>
                </div>
            `;
            break;

        case 'm3u8Downloader':
            modalTitle.textContent = 'm3u8视频下载器';
            modalBody.innerHTML = `
                <div class="form-group">
                    <label for="m3u8Url">m3u8视频URL</label>
                    <input type="url" id="m3u8Url" placeholder="输入m3u8视频地址" class="lazy-load">
                </div>
                <div class="form-group">
                    <label for="videoQuality">视频质量</label>
                    <select id="videoQuality">
                        <option value="auto">自动选择</option>
                        <option value="highest">最高质量</option>
                        <option value="lowest">最低质量</option>
                        <option value="720p">720p</option>
                        <option value="480p">480p</option>
                        <option value="360p">360p</option>
                    </select>
                </div>
                <div class="form-actions">
                    <button class="btn btn-secondary" onclick="closeModal()">取消</button>
                    <button class="btn btn-primary" onclick="loadM3u8Video()">加载视频</button>
                    <button class="btn btn-primary" onclick="downloadM3u8Video()" id="downloadBtn" style="display: none;">下载视频</button>
                </div>
                <div class="loading" id="m3u8Loading" style="display: none;">
                    <div class="spinner"></div>
                    <p>正在加载视频...</p>
                </div>
                <div id="videoContainer" style="display: none;">
                    <h3>视频预览</h3>
                    <video id="m3u8Video" class="video-js vjs-default-skin" controls preload="auto" width="100%" height="300">
                        <p class="vjs-no-js">
                            您的浏览器不支持HTML5视频播放器
                        </p>
                    </video>
                    <div id="videoInfo" style="margin-top: 15px;"></div>
                </div>
                <div id="downloadProgress" class="progress-container" style="display: none;">
                    <div class="progress-bar" id="progressBar"></div>
                </div>
                <div id="downloadLog" class="log-container" style="display: none;"></div>
            `;
            // 延迟加载视频相关资源
            setTimeout(() => {
                const lazyElements = document.querySelectorAll('.lazy-load');
                lazyElements.forEach(el => {
                    el.classList.add('loaded');
                });
            }, 300);
            break;

        case 'workflowSystem':
            modalTitle.textContent = '工作流系统';
            modalBody.innerHTML = `
                <div class="workflow-toolbox">
                    <h4>工具</h4>
                    <div class="workflow-tool" draggable="true" data-type="task">任务</div>
                    <div class="workflow-tool" draggable="true" data-type="decision">决策</div>
                    <div class="workflow-tool" draggable="true" data-type="start">开始</div>
                    <div class="workflow-tool" draggable="true" data-type="end">结束</div>
                </div>
                <div id="workflow-canvas"></div>
                <div class="form-group">
                    <label for="workflowName">工作流名称</label>
                    <input type="text" id="workflowName" placeholder="输入工作流名称">
                </div>
                <div class="form-actions">
                    <button class="btn btn-secondary" onclick="closeModal()">取消</button>
                    <button class="btn btn-primary" onclick="saveWorkflow()">保存工作流</button>
                    <button class="btn btn-primary" onclick="exportWorkflow()">导出工作流</button>
                    <button class="btn btn-primary" onclick="executeWorkflow()">执行工作流</button>
                </div>
                <div class="workflow-properties" id="workflowProperties" style="display: none;">
                    <h4>属性</h4>
                    <div id="propertiesContent"></div>
                </div>
                <div id="executionResult" class="result-container" style="display: none;">
                    <h4>执行结果</h4>
                    <div id="resultContent"></div>
                </div>
            `;
            // 初始化工作流编辑器
            setTimeout(initWorkflowEditor, 100);
            break;
        case 'imageResize':
            modalTitle.textContent = '图片尺寸调整';
            modalBody.innerHTML = `
                <div class="form-group">
                    <label for="resizeImageUpload">上传图片</label>
                    <input type="file" id="resizeImageUpload" accept="image/*" onchange="handleResizeImageUpload(event)">
                </div>
                    <div class="form-group">
                        <label for="width">宽度 (像素)</label>
                        <input type="number" id="width" placeholder="输入宽度" oninput="updateResizePreview()">
                    </div>
                    <div class="form-group">
                        <label for="height">高度 (像素)</label>
                        <input type="number" id="height" placeholder="输入高度" oninput="updateResizePreview()">
                    </div>
                <div class="controls-row">
                    <label>
                        <input type="checkbox" id="maintainAspect" checked onchange="updateResizePreview()"> 保持宽高比
                    </label>
                </div>
                <div class="form-actions">
                    <button class="btn btn-secondary" onclick="closeModal()">取消</button>
                    <button class="btn btn-primary" onclick="downloadResizedImage()">下载图片</button>
                </div>
                <div class="loading" id="resizeLoading" style="display: none;">
                    <div class="spinner"></div>
                    <p>正在处理图片...</p>
                </div>
                <div id="resizePreview" class="preview-container" style="display: none;">
                    <div class="preview-box">
                        <div class="preview-title">原始图片</div>
                        <img id="originalPreview" class="preview-image" src="" alt="原始图片">
                    </div>
                    <div class="preview-box">
                        <div class="preview-title">调整后图片</div>
                        <canvas id="resizedCanvas" class="preview-image"></canvas>
                        <a id="downloadResized" class="download-btn" href="#" download="resized_image.png" style="display: none;">下载图片</a>
                    </div>
                </div>
            `;
            break;

        case 'watermark':
            modalTitle.textContent = '图片添加水印';
            modalBody.innerHTML = `
                <div class="form-group">
                    <label for="watermarkImageUpload">上传图片</label>
                    <input type="file" id="watermarkImageUpload" accept="image/*" onchange="handleWatermarkImageUpload(event)">
                </div>
                <div class="form-group">
                    <label for="watermarkText">水印文字</label>
                    <input type="text" id="watermarkText" placeholder="输入水印文字" value="Watermark" oninput="updateWatermarkPreview()">
                </div>
                
                <div class="controls-row">
                    <div class="control-group">
                        <label for="watermarkColor">水印颜色</label>
                        <input type="color" id="watermarkColor" value="#ffffff" onchange="updateWatermarkPreview()">
                    </div>
                    <div class="control-group">
                        <label for="watermarkOpacity">不透明度</label>
                        <div class="slider-container">
                            <input type="range" id="watermarkOpacity" min="1" max="10" value="5" oninput="updateWatermarkPreview()">
                            <span class="slider-value" id="opacityValue">5</span>
                        </div>
                    </div>
                </div>
                
                <div class="controls-row">
                    <div class="control-group">
                        <label for="watermarkFontSize">字体大小</label>
                        <div class="slider-container">
                            <input type="range" id="watermarkFontSize" min="10" max="100" value="30" oninput="updateWatermarkPreview()">
                            <span class="slider-value" id="fontSizeValue">30</span>
                        </div>
                    </div>
                    <div class="control-group">
                        <label for="watermarkRotation">旋转角度</label>
                        <div class="slider-container">
                            <input type="range" id="watermarkRotation" min="-45" max="45" value="0" oninput="updateWatermarkPreview()">
                            <span class="slider-value" id="rotationValue">0°</span>
                        </div>
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="watermarkPosition">水印位置</label>
                    <select id="watermarkPosition" onchange="updateWatermarkPreview()">
                        <option value="center">居中</option>
                        <option value="top-left">左上角</option>
                        <option value="top-right">右上角</option>
                        <option value="bottom-left">左下角</option>
                        <option value="bottom-right">右下角</option>
                        <option value="diagonal">对角线</option>
                        <option value="tiled">平铺</option>
                    </select>
                </div>
                
                <div class="form-actions">
                    <button class="btn btn-secondary" onclick="closeModal()">取消</button>
                    <button class="btn btn-primary" onclick="downloadWatermarkedImage()">下载图片</button>
                </div>
                
                <div class="loading" id="watermarkLoading" style="display: none;">
                    <div class="spinner"></div>
                    <p>正在添加水印...</p>
                </div>
                
                <div id="watermarkPreview" class="preview-container" style="display: none;">
                    <div class="preview-box">
                        <div class="preview-title">原始图片</div>
                        <img id="originalWatermarkPreview" class="preview-image" src="" alt="原始图片">
                    </div>
                    <div class="preview-box">
                        <div class="preview-title">水印图片</div>
                        <canvas id="watermarkCanvas" class="preview-image"></canvas>
                        <a id="downloadWatermarked" class="download-btn" href="#" download="watermarked_image.png" style="display: none;">下载图片</a>
                    </div>
                </div>
            `;
            break;
        case 'reverseCompoundInterest':
            modalTitle.textContent = '复利逆推计算器';
            modalBody.innerHTML = `
                    <div class="form-group">
                        <label for="principal">本金（元）</label>
                        <input type="number" id="reversePrincipal" placeholder="请输入初始投资金额">
                    </div>
                    <div class="form-group">
                        <label for="finalAmount">最终资产（元）</label>
                        <input type="number" id="reverseFinalAmount" placeholder="请输入最终获得的金额">
                    </div>
                    <div class="form-group">
                        <label for="time">投资时间（年）</label>
                        <input type="number" id="reverseTime" placeholder="请输入投资年限">
                    </div>
                    <div class="form-group">
                        <label for="compoundFrequency">复利频率</label>
                        <select id="reverseCompoundFrequency">
                            <option value="1">每年</option>
                            <option value="2">每半年</option>
                            <option value="4">每季度</option>
                            <option value="12">每月</option>
                        </select>
                    </div>
                    <div class="form-actions">
                        <button class="btn btn-secondary" onclick="closeModal()">取消</button>
                        <button class="btn btn-primary" onclick="calculateReverseCompoundInterest()">计算年化收益</button>
                    </div>
                    <div id="reverseResult" class="result-container" style="display: none;">
                        <h3>计算结果</h3>
                        <div class="result-card">
                            <div class="result-value" id="reverseResultValue">0.00%</div>
                            <div class="result-details">
                                <div class="result-item">
                                    <div class="label">本金</div>
                                    <div class="value" id="reverseResultPrincipal">0.00</div>
                                </div>
                                <div class="result-item">
                                    <div class="label">最终资产</div>
                                    <div class="value" id="reverseResultFinalAmount">0.00</div>
                                </div>
                                <div class="result-item">
                                    <div class="label">投资时间</div>
                                    <div class="value" id="reverseResultTime">0</div>
                                </div>
                                <div class="result-item">
                                    <div class="label">复利频率</div>
                                    <div class="value" id="reverseResultFrequency">每年</div>
                                </div>
                            </div>
                            <div class="visualization" id="reverseVisualization">
                                <!-- 可视化图表将在这里生成 -->
                            </div>
                        </div>
                        <a id="downloadReverseResult" class="download-btn" href="#" download="reverse_compound_result.txt">下载结果</a>
                    </div>
                `;
            break;

        case 'compoundInterest':
            modalTitle.textContent = '复利计算器';
            modalBody.innerHTML = `
                <div class="form-group">
                    <label for="principal">本金 (元)</label>
                    <input type="number" id="principal" placeholder="输入初始投资金额">
                </div>
                <div class="form-group">
                    <label for="rate">年利率 (%)</label>
                    <input type="number" id="rate" step="0.1" placeholder="输入年利率">
                </div>
                <div class="form-group">
                    <label for="time">投资年限</label>
                    <input type="number" id="time" placeholder="输入投资年限">
                </div>
                <div class="form-group">
                    <label for="compoundFrequency">复利频率</label>
                    <select id="compoundFrequency">
                        <option value="1">每年</option>
                        <option value="2">每半年</option>
                        <option value="4">每季度</option>
                        <option value="12">每月</option>
                    </select>
                </div>
                <div class="form-actions">
                    <button class="btn btn-secondary" onclick="closeModal()">取消</button>
                    <button class="btn btn-primary" onclick="calculateCompoundInterest()">计算</button>
                </div>
                <div id="result" class="result-container" style="display: none;">
                    <h3>计算结果</h3>
                    <p id="resultText"></p>
                    <a id="downloadResult" class="download-btn" href="#" download="复利计算结果.txt" style="display: none;">下载结果</a>
                </div>
            `;
            break;



        case 'videoConverter':
            modalTitle.textContent = '视频格式转换';
            modalBody.innerHTML = `
                <div class="form-group">
                    <label for="videoFile">上传视频文件</label>
                    <input type="file" id="videoFile" accept="video/*">
                </div>
                <div class="form-group">
                    <label for="outputFormat">输出格式</label>
                    <select id="outputFormat">
                        <option value="mp4">MP4</option>
                        <option value="avi">AVI</option>
                        <option value="mov">MOV</option>
                        <option value="gif">GIF</option>
                        <option value="webm">WebM</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="videoQuality">视频质量</label>
                    <select id="videoQuality">
                        <option value="high">高质量</option>
                        <option value="medium">中等质量</option>
                        <option value="low">低质量</option>
                    </select>
                </div>
                <div class="form-actions">
                    <button class="btn btn-secondary" onclick="closeModal()">取消</button>
                    <button class="btn btn-primary" onclick="convertVideo()">转换</button>
                </div>
                <div class="loading" id="videoLoading" style="display: none;">
                    <div class="spinner"></div>
                    <p>正在转换视频...</p>
                </div>
                <div id="videoResult" class="result-container" style="display: none;">
                    <h3>转换结果</h3>
                    <video id="convertedVideo" controls style="max-width: 100%;"></video>
                    <a id="downloadVideo" class="download-btn" href="#" download="converted_video.mp4">下载视频</a>
                </div>
            `;
            break;

        case 'pdfTools':
            modalTitle.textContent = 'PDF工具包';
            modalBody.innerHTML = `
                <div class="form-group">
                    <label for="pdfFiles">上传PDF文件</label>
                    <input type="file" id="pdfFiles" accept=".pdf" multiple>
                </div>
                <div class="form-group">
                    <label for="pdfAction">选择操作</label>
                    <select id="pdfAction">
                        <option value="merge">合并PDF</option>
                        <option value="split">分割PDF</option>
                        <option value="compress">压缩PDF</option>
                        <option value="convert">转换为Word</option>
                        <option value="protect">添加密码保护</option>
                    </select>
                </div>
                <div id="actionOptions" style="display: none;">
                    <!-- 根据选择的操作显示不同选项 -->
                </div>
                <div class="form-actions">
                    <button class="btn btn-secondary" onclick="closeModal()">取消</button>
                    <button class="btn btn-primary" onclick="processPdf()">执行操作</button>
                </div>
                <div class="loading" id="pdfLoading" style="display: none;">
                    <div class="spinner"></div>
                    <p>正在处理PDF文件...</p>
                </div>
                <div id="pdfPreview" class="pdf-preview" style="display: none;">
                    <canvas id="pdfCanvas"></canvas>
                </div>
                <div id="pdfResult" class="result-container" style="display: none;">
                    <h3>处理结果</h3>
                    <p id="pdfResultText"></p>
                    <a id="downloadPdf" class="download-btn" href="#" download="processed_pdf.pdf">下载结果</a>
                </div>
            `;

            // 监听操作选择变化
            document.getElementById('pdfAction').addEventListener('change', function () {
                const action = this.value;
                const optionsContainer = document.getElementById('actionOptions');
                optionsContainer.style.display = 'block';

                let optionsHtml = '';
                switch (action) {
                    case 'merge':
                        optionsHtml = `
                            <div class="form-group">
                                <label>已选择文件: <span id="fileCount">0</span></label>
                            </div>
                            <div class="form-group">
                                <label for="mergeOrder">合并顺序</label>
                                <select id="mergeOrder">
                                    <option value="filename">按文件名</option>
                                    <option value="upload">按上传顺序</option>
                                </select>
                            </div>`;
                        break;
                    case 'split':
                        optionsHtml = `
                            <div class="form-group">
                                <label for="splitMethod">分割方式</label>
                                <select id="splitMethod">
                                    <option value="page">按页码分割</option>
                                    <option value="size">按文件大小分割</option>
                                </select>
                            </div>
                            <div class="form-group" id="pageRangeGroup">
                                <label for="pageRange">页码范围 (例如: 1-5,8,10-12)</label>
                                <input type="text" id="pageRange" placeholder="输入页码范围">
                            </div>`;
                        break;
                    case 'compress':
                        optionsHtml = `
                            <div class="form-group">
                                <label for="compressionLevel">压缩级别</label>
                                <select id="compressionLevel">
                                    <option value="low">低压缩 (高质量)</option>
                                    <option value="medium">中等压缩</option>
                                    <option value="high">高压缩 (低质量)</option>
                                </select>
                            </div>`;
                        break;
                    case 'convert':
                        optionsHtml = `
                            <div class="form-group">
                                <label for="convertFormat">转换格式</label>
                                <select id="convertFormat">
                                    <option value="docx">Word (.docx)</option>
                                    <option value="txt">纯文本 (.txt)</option>
                                    <option value="image">图片 (.png)</option>
                                </select>
                            </div>`;
                        break;
                    case 'protect':
                        optionsHtml = `
                            <div class="form-group">
                                <label for="pdfPassword">设置密码</label>
                                <input type="password" id="pdfPassword" placeholder="输入密码">
                            </div>
                            <div class="form-group">
                                <label for="confirmPassword">确认密码</label>
                                <input type="password" id="confirmPassword" placeholder="再次输入密码">
                            </div>`;
                        break;
                }

                optionsContainer.innerHTML = optionsHtml;
            });
            break;

        case 'lrcToSrt':
            modalTitle.textContent = 'LRC转SRT工具';
            modalBody.innerHTML = `
                <div class="form-group">
                    <label for="lrcFile">上传LRC文件</label>
                    <input type="file" id="lrcFile" accept=".lrc">
                </div>
                <div class="form-group">
                    <label for="offset">时间偏移 (毫秒)</label>
                    <input type="number" id="offset" value="0">
                </div>
                <div class="form-actions">
                    <button class="btn btn-secondary" onclick="closeModal()">取消</button>
                    <button class="btn btn-primary" onclick="convertLrcToSrt()">转换</button>
                </div>
                <div class="loading" id="lrcLoading" style="display: none;">
                    <div class="spinner"></div>
                    <p>正在转换...</p>
                </div>
                <div id="lrcResult" class="result-container" style="display: none;">
                    <h3>转换结果</h3>
                    <textarea id="srtPreview" class="text-area"></textarea>
                    <a id="downloadSrt" class="download-btn" href="#" download="converted_subtitle.srt">下载SRT文件</a>
                </div>
            `;
            break;

        case 'textEncrypt':
            modalTitle.textContent = '文本加密解密';
            modalBody.innerHTML = `
                <div class="form-group">
                    <label for="textInput">输入文本</label>
                    <textarea id="textInput" class="text-area" placeholder="输入要加密或解密的文本"></textarea>
                </div>
                <div class="form-group">
                    <label for="encryptionKey">加密密钥</label>
                    <input type="password" id="encryptionKey" placeholder="输入加密密钥">
                </div>
                <div class="form-group">
                    <label for="operation">操作</label>
                    <select id="operation">
                        <option value="encrypt">加密</option>
                        <option value="decrypt">解密</option>
                    </select>
                </div>
                <div class="form-actions">
                    <button class="btn btn-secondary" onclick="closeModal()">取消</button>
                    <button class="btn btn-primary" onclick="processText()">执行</button>
                </div>
                <div id="textResult" class="result-container" style="display: none;">
                    <h3>处理结果</h3>
                    <textarea id="resultText" class="text-area"></textarea>
                    <a id="downloadText" class="download-btn" href="#" download="processed_text.txt">下载结果</a>
                </div>
            `;
            break;
        // 二维码生成工具
        case 'qrGenerator':
            modalTitle.textContent = '二维码生成器';
            modalBody.innerHTML = `
                <div class="form-group">
                    <label for="qrContent">二维码内容</label>
                    <textarea id="qrContent" class="text-area" placeholder="输入文本、URL或联系方式"></textarea>
                </div>
                <div class="form-group">
                    <label for="qrSize">二维码尺寸</label>
                    <select id="qrSize">
                        <option value="128">128x128</option>
                        <option value="256" selected>256x256</option>
                        <option value="512">512x512</option>
                    </select>
                </div>
                <div class="form-actions">
                    <button class="btn btn-secondary" onclick="closeModal()">取消</button>
                    <button class="btn btn-primary" onclick="generateQRCode()">生成二维码</button>
                </div>
                <div class="qr-container" id="qrResult" style="display: none;">
                    <h3>生成的二维码</h3>
                    <div id="qrcode"></div>
                    <button class="btn btn-primary" onclick="downloadQRCode()" style="margin: 10px auto;">
                        <i class="fas fa-download"></i> 下载二维码
                    </button>
                </div>
            `;
            break;

        // 图片无损压缩工具
        case 'imageCompressor':
            modalTitle.textContent = '图片无损压缩';
            modalBody.innerHTML = `
                <div class="form-group">
                    <label for="compressImage">上传图片</label>
                    <input type="file" id="compressImage" accept="image/*">
                </div>
                <div class="form-group">
                    <label for="qualityLevel">压缩质量</label>
                    <select id="qualityLevel">
                        <option value="0.9">高质量 (90%)</option>
                        <option value="0.7" selected>中等质量 (70%)</option>
                        <option value="0.5">低质量 (50%)</option>
                    </select>
                </div>
                <div class="form-actions">
                    <button class="btn btn-secondary" onclick="closeModal()">取消</button>
                    <button class="btn btn-primary" onclick="compressImage()">压缩图片</button>
                </div>
                <div class="compression-preview" id="compressionResult" style="display: none;">
                    <div class="preview-item">
                        <h3>原始图片</h3>
                        <img id="originalPreview" class="preview-image">
                        <div id="originalSize" class="size-info"></div>
                    </div>
                    <div class="preview-item">
                        <h3>压缩后图片</h3>
                        <img id="compressedPreview" class="preview-image">
                        <div id="compressedSize" class="size-info"></div>
                        <button class="btn btn-primary" onclick="downloadCompressedImage()">
                            <i class="fas fa-download"></i> 下载图片
                        </button>
                    </div>
                </div>
            `;
            break;

        // 短链生成工具
        case 'urlShortener':
            modalTitle.textContent = '短链生成器';
            modalBody.innerHTML = `
                <div class="form-group">
                    <label for="longUrl">长URL</label>
                    <input type="url" id="longUrl" placeholder="输入需要缩短的URL">
                </div>
                <div class="form-group">
                    <label for="customAlias">自定义别名 (可选)</label>
                    <input type="text" id="customAlias" placeholder="输入自定义别名">
                </div>
                <div class="form-actions">
                    <button class="btn btn-secondary" onclick="closeModal()">取消</button>
                    <button class="btn btn-primary" onclick="generateShortUrl()">生成短链</button>
                </div>
                <div class="shortener-result" id="shortenerResult">
                    <h3>生成的短链</h3>
                    <div class="short-url" id="shortUrl"></div>
                    <button class="btn btn-primary" onclick="copyShortUrl()">
                        <i class="fas fa-copy"></i> 复制短链
                    </button>
                </div>
            `;
            break;
        // 歌曲BPM计算器
        case 'bpmCalculator':
            modalTitle.textContent = '歌曲BPM计算器';
            modalBody.innerHTML = `
            <div class="bpm-container">
        <!-- 移除内部标题 -->
        <div class="visualizer">
            <div class="beat-bar" id="beatBar"></div>
            <div class="beat-indicator" id="beatIndicator"></div>
        </div>
        <div class="bpm-display" id="bpmDisplay">0</div>
        <div class="tap-area" id="tapButton">
            <div class="tap-instruction" =>点击此处或按空格键</div>
            <div class="tap-count">已敲击: <span id="tapCount">0</span> 次</div>
        </div>
        <div class="controls">
            <button class="btn btn-primary" id="resetBtn" >重置</button>
            <button class="btn btn-secondary" id="infoBtn">使用说明</button>
        </div>
        <p class="hint">
            提示：至少敲击4次才能获得准确结果
        </p>
    </div>
            `;
            //初始化计算器
            initBpmCalculator()

            break;
        case 'reverbCalculator':
            modalTitle.textContent = '混响时间计算器';
            modalBody.innerHTML = `
                        <p>根据BPM值计算房间、板式和厅堂混响的预延迟和衰减时间参考值。</p>
                        
                        <div class="form-group">
                            <label for="bpmInput">BPM值（每分钟节拍数）</label>
                            <input type="number" id="bpmInput" class="bpm-input" value="120" min="1" max="300" placeholder="输入1-300之间的BPM值">
                        </div>
                        
                        <div class="form-actions">
                            <button class="btn btn-secondary" onclick="closeModal()">取消</button>
                            <button class="btn btn-primary" onclick="calculateReverbTimes()">计算</button>
                        </div>
                        
                        <div id="reverbResult" class="result-container" style="display: none;">
                            <h3>计算结果</h3>
                            
                            <div class="reverb-results">
                                <div class="reverb-result-card">
                                    <h3>房间混响</h3>
                                    <div class="reverb-param">
                                        <div class="param-label">发送量</div>
                                        <div class="param-value">-15 至 -20 dB</div>
                                        <div class="param-range">(非常低)</div>
                                    </div>
                                    <div class="reverb-param">
                                        <div class="param-label">预延迟</div>
                                        <div class="param-value" id="roomPreDelay">0 ms</div>
                                        <div class="param-range">参考范围: 0-10 ms</div>
                                        <div class="value-list" id="roomPreDelayValues"></div>
                                    </div>
                                    <div class="reverb-param">
                                        <div class="param-label">衰减时间</div>
                                        <div class="param-value" id="roomDecay">0.7 秒</div>
                                        <div class="param-range">参考范围: 0.4-1.0 秒</div>
                                        <div class="value-list" id="roomDecayValues"></div>
                                    </div>
                                    <p class="note">增加真实感，发送量要小到"几乎听不见但能感觉到"</p>
                                </div>
                                
                                <div class="reverb-result-card">
                                    <h3>板式混响</h3>
                                    <div class="reverb-param">
                                        <div class="param-label">发送量</div>
                                        <div class="param-value">0 dB</div>
                                        <div class="param-range">(推子推到0，作为基准)</div>
                                    </div>
                                    <div class="reverb-param">
                                        <div class="param-label">预延迟</div>
                                        <div class="param-value" id="platePreDelay">0 ms</div>
                                        <div class="param-range">参考范围: 10-30 ms</div>
                                        <div class="value-list" id="platePreDelayValues"></div>
                                    </div>
                                    <div class="reverb-param">
                                        <div class="param-label">衰减时间</div>
                                        <div class="param-value" id="plateDecay">2.0 秒</div>
                                        <div class="param-range">参考范围: 1.5-2.5 秒</div>
                                        <div class="value-list" id="plateDecayValues"></div>
                                    </div>
                                    <p class="note">人声最主要的混响，发送量最大, 增加魅力和光泽</p>
                                </div>
                                
                                <div class="reverb-result-card">
                                    <h3>厅堂混响</h3>
                                    <div class="reverb-param">
                                        <div class="param-label">发送量</div>
                                        <div class="param-value">-8 至 -12 dB</div>
                                        <div class="param-range">(比板式低很多)</div>
                                    </div>
                                    <div class="reverb-param">
                                        <div class="param-label">预延迟</div>
                                        <div class="param-value" id="hallPreDelay">0 ms</div>
                                        <div class="param-range">参考范围: 20-40 ms</div>
                                        <div class="value-list" id="hallPreDelayValues"></div>
                                    </div>
                                    <div class="reverb-param">
                                        <div class="param-label">衰减时间</div>
                                        <div class="param-value" id="hallDecay">2.5 秒</div>
                                        <div class="param-range">参考范围: 2.0-4.0 秒</div>
                                        <div class="value-list" id="hallDecayValues"></div>
                                    </div>
                                    <p class="note">营造空间氛围感，发送量适中，避免模糊</p>
                                </div>
                            </div>
                            
                            <div style="margin-top: 20px; text-align: center;">
                                <a id="downloadReverbResult" class="download-btn" href="#" download="reverb_calculator_result.txt">下载结果</a>
                            </div>
                        </div>

                        <h3 style="margin-top: 30px;">混响参数参考表</h3>
                        <table class="reverb-table">
                            <thead>
                                <tr>
                                    <th>混响类型</th>
                                    <th>发送量（建议起点）</th>
                                    <th>预延迟</th>
                                    <th>衰减时间</th>
                                    <th>备注</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td class="reverb-type">板式混响</td>
                                    <td>0 dB (推子推到0，作为基准)</td>
                                    <td>10-30 ms</td>
                                    <td>1.5 - 2.5 秒</td>
                                    <td>人声最主要的混响，发送量最大, 增加魅力和光泽</td>
                                </tr>
                                <tr>
                                    <td class="reverb-type">厅堂混响</td>
                                    <td>-8 dB 至 -12 dB (比板式低很多)</td>
                                    <td>20-40 ms</td>
                                    <td>2.0 - 4.0 秒</td>
                                    <td>营造空间氛围感，发送量适中, 避免模糊</td>
                                </tr>
                                <tr>
                                    <td class="reverb-type">房间混响</td>
                                    <td>-15 dB 至 -20 dB (非常低)</td>
                                    <td>0-10 ms</td>
                                    <td>0.4 - 1.0 秒</td>
                                    <td>增加真实感，发送量要小到"几乎听不见但能感觉到"</td>
                                </tr>
                            </tbody>
                        </table>
                    `;
            break;

        case 'compressorRelease':
            modalTitle.textContent = '压缩释放时间计算器';
            modalBody.innerHTML = `
                            <div class="form-group">
                                <label for="bpmInput">BPM值（每分钟节拍数）</label>
                                <input type="number" id="bpmInput" class="bpm-input" value="120" min="1" max="300" placeholder="输入1-300之间的BPM值">
                            </div>
                            <div class="form-actions">
                                <button class="btn btn-secondary" onclick="closeModal()">取消</button>
                                <button class="btn btn-primary" onclick="calculateCompressorRelease()">计算</button>
                            </div>
                            <div id="compressorResult" class="result-container" style="display: none;">
                                <h3>计算结果</h3>
                                <div class="result-card">
                                    <div class="result-details" id="resultContainer">
                                        <div class="result-item">
                                            <div class="label">底鼓</div>
                                            <div class="value" id="kickRelease">0 ms</div>
                                            <div class="note">建议范围: 50-150ms</div>
                                        </div>
                                        <div class="result-item">
                                            <div class="label">军鼓</div>
                                            <div class="value" id="snareRelease">0 ms</div>
                                            <div class="note">建议范围: 100-200ms</div>
                                        </div>
                                        <div class="result-item">
                                            <div class="label">贝斯</div>
                                            <div class="value" id="bassRelease">0 ms</div>
                                            <div class="note">建议范围: 150-300ms</div>
                                        </div>
                                        <div class="result-item">
                                            <div class="label">人声</div>
                                            <div class="value" id="vocalRelease">0 ms</div>
                                            <div class="note">建议范围: 200-400ms</div>
                                        </div>
                                        <div class="result-item">
                                            <div class="label">吉他</div>
                                            <div class="value" id="guitarRelease">0 ms</div>
                                            <div class="note">建议范围: 100-250ms</div>
                                        </div>
                                        <div class="result-item">
                                            <div class="label">钢琴</div>
                                            <div class="value" id="pianoRelease">0 ms</div>
                                            <div class="note">建议范围: 200-500ms</div>
                                        </div>
                                    </div>
                                    <div class="visualization" id="releaseVisualization" style="display: none;">
                                        <!-- 可视化图表将在这里生成 -->
                                    </div>
                                </div>
                                <a id="downloadCompressorResult" class="download-btn" href="#" download="compressor_release_result.txt">下载结果</a>
                                
                            </div>
                            
                            <div class="audio-table-container" style="margin-top: 30px;">
        <div class="table-header">
            <h1>音乐制作压缩参数参考表</h1>
            <p>专业音频处理参数指南 - 适用于音乐制作与混音</p>
        </div>
        
        <table>
            <thead>
                <tr>
                    <th>乐器/音源</th>
                    <th>启动时间 (Attack)</th>
                    <th>释放时间 (Release)</th>
                    <th>压缩比 (Ratio)</th>
                    <th>核心目标</th>
                    <th>重要注意事项</th>
                </tr>
            </thead>
            <tbody>
                    <tr>
                        <td class="category-header" colspan="6">常见乐器</td>
                    </tr>
                    <tr>
                        <td class="instrument">人声(主唱)</td>
                        <td>
                            <span class="param-range">10-50ms</span>
                            <span class="param-value">20ms</span>
                        </td>
                        <td>
                            <span class="param-range">50-300ms</span>
                            <span class="param-value">100ms(或Auto)</span>
                        </td>
                        <td>
                            <span class="param-range">2:1-4:1</span>
                            <span class="param-value">3:1</span>
                        </td>
                        <td>保留咬字清晰度,平衡动态起伏</td>
                        <td class="important-note">抒情歌用低压缩比(2:1),流行/摇滚可提高至4:1</td>
                    </tr>
                    <tr>
                        <td class="instrument">背景和声</td>
                        <td>
                            <span class="param-range">5-30ms</span>
                            <span class="param-value">15ms</span>
                        </td>
                        <td>
                            <span class="param-range">30-200ms</span>
                            <span class="param-value">80ms</span>
                        </td>
                        <td>
                            <span class="param-range">3:1-6:1</span>
                            <span class="param-value">4:1</span>
                        </td>
                        <td>增强融合度,弱化个体存在感</td>
                        <td class="important-note">高压缩比(4:1+)提升"垫底"效果</td>
                    </tr>
                    <tr>
                        <td class="instrument">原声吉他</td>
                        <td>
                            <span class="param-range">20-60ms</span>
                            <span class="param-value">30ms</span>
                        </td>
                        <td>
                            <span class="param-range">50-300ms</span>
                            <span class="param-value">150ms</span>
                        </td>
                        <td>
                            <span class="param-range">2:1-4:1</span>
                            <span class="param-value">2.5:1</span>
                        </td>
                        <td>保留拨弦音头,控制尾音动态</td>
                        <td class="important-note">分解和弦宜轻压缩(2:1),扫弦节奏可用3:1</td>
                    </tr>
                    <tr>
                        <td class="instrument">电吉他(清音/过载)</td>
                        <td>
                            <span class="param-range">10-40ms</span>
                            <span class="param-value">20ms</span>
                        </td>
                        <td>
                            <span class="param-range">40-250ms</span>
                            <span class="param-value">120ms</span>
                        </td>
                        <td>
                            <span class="param-range">2:1-6:1</span>
                            <span class="param-value">3:1</span>
                        </td>
                        <td>维持音色特质,略微收紧峰值</td>
                        <td class="important-note">高失真音色禁用压缩(除非修复录音)</td>
                    </tr>
                    <tr>
                        <td class="instrument">钢琴(原声)</td>
                        <td>
                            <span class="param-range">30-100ms+</span>
                            <span class="param-value">50ms</span>
                        </td>
                        <td>
                            <span class="param-range">100ms-1s+</span>
                            <span class="param-value">300ms (Auto)</span>
                        </td>
                        <td>
                            <span class="param-range">1.5:1-3:1</span>
                            <span class="param-value">2:1</span>
                        </td>
                        <td>绝对保留击键感,均匀化衰减尾音</td>
                        <td class="important-note">高于3:1会破坏自然动态</td>
                    </tr>
                    <tr>
                        <td class="instrument">电钢琴</td>
                        <td>
                            <span class="param-range">10-40ms</span>
                            <span class="param-value">25ms</span>
                        </td>
                        <td>
                            <span class="param-range">50-400ms</span>
                            <span class="param-value">200ms</span>
                        </td>
                        <td>
                            <span class="param-range">3:1-5:1</span>
                            <span class="param-value">4:1</span>
                        </td>
                        <td>控制延音电平,避免音色碎片化</td>
                        <td class="important-note">FM电钢需低压缩比(2:1)保金属质感</td>
                    </tr>
                    <tr>
                        <td class="instrument">贝斯(指弹)</td>
                        <td>
                            <span class="param-range">5-20ms</span>
                            <span class="param-value">10ms</span>
                        </td>
                        <td>
                            <span class="param-range">20-200ms</span>
                            <span class="param-value">50ms</span>
                        </td>
                        <td>
                            <span class="param-range">3:1-8:1</span>
                            <span class="param-value">4:1</span>
                        </td>
                        <td>强化音头冲击力,压制低频泛滥</td>
                        <td class="important-note">高压缩比(6:1+)提升"向前冲"感</td>
                    </tr>
                    <tr>
                        <td class="instrument">贝斯(Slap)</td>
                        <td>
                            <span class="param-range">10-30ms</span>
                            <span class="param-value">15ms</span>
                        </td>
                        <td>
                            <span class="param-range">50-150ms</span>
                            <span class="param-value">80ms</span>
                        </td>
                        <td>
                            <span class="param-range">4:1-10:1</span>
                            <span class="param-value">6:1</span>
                        </td>
                        <td>抑制高频瞬态爆音,维持低频稳定</td>
                        <td class="important-note">极快释放(50ms)制造"抽吸"节奏感</td>
                    </tr>
                    <tr>
                        <td class="category-header" colspan="6">打击乐器</td>
                    </tr>
                    <tr>
                        <td class="instrument">底鼓(Kick)</td>
                        <td>
                            <span class="param-range">1-30ms</span>
                            <span class="param-value">10ms</span>
                        </td>
                        <td>
                            <span class="param-range">20-200ms</span>
                            <span class="param-value">50ms</span>
                        </td>
                        <td>
                            <span class="param-range">2:1-6:1</span>
                            <span class="param-value">4:1</span>
                        </td>
                        <td>短启动增力度,长启动增弹性</td>
                        <td class="important-note">EDM用高压缩比(6:1)+短释放(30ms)塑形</td>
                    </tr>
                    <tr>
                        <td class="instrument">军鼓(Snare)</td>
                        <td>
                            <span class="param-range">5-30ms</span>
                            <span class="param-value">15ms</span>
                        </td>
                        <td>
                            <span class="param-range">50-300ms</span>
                            <span class="param-value">150ms</span>
                        </td>
                        <td>
                            <span class="param-range">3:1-8:1</span>
                            <span class="param-value">4:1</span>
                        </td>
                        <td>控制瞬态冲击,增强鼓腔共鸣</td>
                        <td class="important-note">录音过爆时用极限压缩(8:1+5ms)修复</td>
                    </tr>
                    <tr>
                        <td class="instrument">通鼓(Toms)</td>
                        <td>
                            <span class="param-range">10-40ms</span>
                            <span class="param-value">20ms</span>
                        </td>
                        <td>
                            <span class="param-range">100-500ms</span>
                            <span class="param-value">250ms</span>
                        </td>
                        <td>
                            <span class="param-range">3:1-5:1</span>
                            <span class="param-value">4:1</span>
                        </td>
                        <td>平衡击打感与共鸣衰减</td>
                        <td class="important-note">大通鼓用慢释放(400ms)匹配低频衰减</td>
                    </tr>
                    <tr>
                        <td class="instrument">大鼓/堂鼓</td>
                        <td>
                            <span class="param-range">1-20ms</span>
                            <span class="param-value">5ms</span>
                        </td>
                        <td>
                            <span class="param-range">100-600ms</span>
                            <span class="param-value">300ms</span>
                        </td>
                        <td>
                            <span class="param-range">3:1-6:1</span>
                            <span class="param-value">4:1</span>
                        </td>
                        <td>增强击打瞬间的冲击力，控制鼓腔的长频共鸣</td>
                        <td class="important-note">根据乐曲需要：短启动+短释放(80ms)增加力度感；长释放匹配低频自然衰减</td>
                    </tr>
                    <tr>
                        <td class="category-header" colspan="6">管弦乐器</td>
                    </tr>
                    <tr>
                        <td class="instrument">弦乐队(合奏)</td>
                        <td>
                            <span class="param-range">20-100ms</span>
                            <span class="param-value">50ms</span>
                        </td>
                        <td>
                            <span class="param-range">200ms-1s+</span>
                            <span class="param-value">500ms (Auto)</span>
                        </td>
                        <td>
                            <span class="param-range">1.5:1-3:1</span>
                            <span class="param-value">2:1</span>
                        </td>
                        <td>保留自然绵延感,轻微平滑动态</td>
                        <td class="important-note">高于3:1会产生机械感</td>
                    </tr>
                    <tr>
                        <td class="instrument">管乐(萨克斯/小号)</td>
                        <td>
                            <span class="param-range">10-40ms</span>
                            <span class="param-value">25ms</span>
                        </td>
                        <td>
                            <span class="param-range">100-500ms</span>
                            <span class="param-value">200ms</span>
                        </td>
                        <td>
                            <span class="param-range">2:1-5:1</span>
                            <span class="param-value">3:1</span>
                        </td>
                        <td>控制强音爆发,保留气息细节</td>
                        <td class="important-note">爵士乐solo宜低压缩比(2:1)</td>
                    </tr>
                    <tr>
                        <td class="category-header" colspan="6">中国传统乐器</td>
                    </tr>
                    <tr>
                        <td class="instrument">二胡</td>
                        <td>
                            <span class="param-range">20-80ms</span>
                            <span class="param-value">40ms</span>
                        </td>
                        <td>
                            <span class="param-range">100-500ms</span>
                            <span class="param-value">200ms (或Auto)</span>
                        </td>
                        <td>
                            <span class="param-range">2:1-4:1</span>
                            <span class="param-value">2.5:1</span>
                        </td>
                        <td>保留揉弦与滑音的韵味，控制强弓的突兀感</td>
                        <td class="important-note">过快的启动会削弱琴弓的"擦弦"质感；慢启动可保留乐句的歌唱性</td>
                    </tr>
                    <tr>
                        <td class="instrument">笛子/箫</td>
                        <td>
                            <span class="param-range">5-25ms</span>
                            <span class="param-value">10ms</span>
                        </td>
                        <td>
                            <span class="param-range">50-300ms</span>
                            <span class="param-value">120ms</span>
                        </td>
                        <td>
                            <span class="param-range">2:1-5:1</span>
                            <span class="param-value">3:1</span>
                        </td>
                        <td>控制高音区的气息爆发音(喷口)，保持音色圆润</td>
                        <td class="important-note">针对花舌等快速技巧，释放时间不宜过慢，以免产生"抽吸感"</td>
                    </tr>
                    <tr>
                        <td class="instrument">古筝/琵琶</td>
                        <td>
                            <span class="param-range">10-40ms</span>
                            <span class="param-value">20ms</span>
                        </td>
                        <td>
                            <span class="param-range">100-400ms</span>
                            <span class="param-value">250ms</span>
                        </td>
                        <td>
                            <span class="param-range">2:1-4:1</span>
                            <span class="param-value">3:1</span>
                        </td>
                        <td>保留"劈、托、抹"等指法的音头，均匀化余音的衰减</td>
                        <td class="important-note">扫摇等激烈技法可提高压缩比(4:1)以控制整体动态；慢板乐曲宜用低比值(2:1)</td>
                    </tr>
                    <tr>
                        <td class="instrument">古琴</td>
                        <td>
                            <span class="param-range">30-150ms+</span>
                            <span class="param-value">80ms</span>
                        </td>
                        <td>
                            <span class="param-range">300ms-2s+</span>
                            <span class="param-value">800ms (Auto)</span>
                        </td>
                        <td>
                            <span class="param-range">1.5:1-2.5:1</span>
                            <span class="param-value">2:1</span>
                        </td>
                        <td>极其谨慎地处理，最大程度保留其自然的动态和空间感</td>
                        <td class="important-note">压缩比绝对不要超过3:1,否则会彻底破坏古琴宁静、深邃的意境</td>
                    </tr>
                </tbody>
        </table>
    </div>
    
    <div class="footer-note">
        <p>注：参数值为通用参考范围，实际应用需根据具体音频素材和音乐风格调整</p>
    </div>
                        `;
            break;
        // 在线直播
        case 'liveStream':
            modalTitle.textContent = '在线直播';
            modalBody.innerHTML = `
                <div class="form-group">
                    <label for="streamUrl">直播URL</label>
                    <input type="url" id="streamUrl" placeholder="输入直播流地址 (m3u8格式)" class="form-control">
                </div>
                <div class="form-actions">
                    <button class="btn btn-secondary" onclick="closeModal()">取消</button>
                    <button class="btn btn-primary" onclick="playStream()">播放直播</button>
                </div>
                <div class="video-container" id="videoContainer">
                    <div class="video-placeholder">
                        请输入直播URL并点击播放
                    </div>
                </div>
            `;
            break;

        // 在线看电视
        case 'tvChannels':
            modalTitle.textContent = '在线看电视';
            modalBody.innerHTML = `
             <div class="tv-container">
                            <div class="tv-search">
                                <input type="text" id="tvSearch" placeholder="搜索频道...">
                                <button onclick="searchChannels()"><i class="fas fa-search"></i></button>
                            </div>
                            
                            <div class="tv-categories">
                                <div class="tv-category active" data-category="all">全部</div>
                                <div class="tv-category" data-category="综合">综合</div>
                                <div class="tv-category" data-category="体育">体育</div>
                                <div class="tv-category" data-category="娱乐">娱乐</div>
                                <div class="tv-category" data-category="新闻">新闻</div>
                                <div class="tv-category" data-category="纪录片">纪录片</div>
                            </div>
                            
                            <div class="tv-player-container">
                                <video id="tvPlayer" class="video-js vjs-default-skin" controls preload="auto">
                                    <p class="vjs-no-js">
                                        您的浏览器不支持HTML5视频播放器
                                    </p>
                                </video>
                                <div class="tv-controls">
                                    <button class="btn btn-primary" onclick="toggleFullscreen()">
                                        <i class="fas fa-expand"></i> 全屏
                                    </button>
                                    <div id="currentChannel">请选择频道</div>
                                    <button class="btn btn-primary" onclick="toggleMute()">
                                        <i class="fas fa-volume-up"></i>
                                    </button>
                                </div>
                            </div>
                            
                            <div class="channel-list" id="channelList">
                                <!-- 频道列表将通过JS动态生成 -->
                            </div>
                        </div>
            `;
            // 初始化电视播放器
            setTimeout(() => {
                initTVPlayer();
                renderChannelList(tvChannels);
                setupCategoryFilters();
            }, 100);
            break;
        // 每日新闻
        case 'dailyNews':
            modalTitle.textContent = '每日新闻简讯';
            modalBody.innerHTML = `
           <div class="news-container">
                            <div class="loading" id="newsLoading">
                                <div class="spinner"></div>
                                <p>正在加载新闻...</p>
                            </div>
                            <div id="newsContent" style="display: none;">
                                <div class="news-header">
                                    <h3 class="news-date" id="newsDate"></h3>
                                    <button class="refresh-btn" onclick="loadNews()" style="display: none;">
                                        <i class="fas fa-sync-alt"></i> 刷新
                                    </button>
                                </div>
                                <img id="newsImage" class="news-image" src="" alt="新闻图片" style="display: none;">
                                <div class="news-list" id="newsList"></div>
                                <div class="news-weiyu" id="newsWeiyu"></div>
                            </div>
                            <div id="newsError" style="display: none; color: var(--danger-color);">
                                加载新闻失败，请重试。
                            </div>
                        </div>
                    `;
            // 加载新闻
            loadNews();
            break;
        case 'fcGames':
            needShowModal = false
            //跳转到二级页面
            // window.location.assign("./pages/music-release.html");
            window.open("./game/index.html", '_blank');
        case 'fcGames':
            modalTitle.textContent = 'FC在线游戏';
            modalBody.innerHTML = `
                    <div class="game-container">
                        <h3>选择游戏</h3>
                        <div class="game-selector">
                            <div class="game-item active" onclick="selectGame('super-mario')">
                                <i class="fas fa-running"></i>
                                <div>超级马里奥</div>
                            </div>
                            <div class="game-item" onclick="selectGame('contra')">
                                <i class="fas fa-gun"></i>
                                <div>魂斗罗</div>
                            </div>
                            <div class="game-item" onclick="selectGame('tetris')">
                                <i class="fas fa-cubes"></i>
                                <div>俄罗斯方块</div>
                            </div>
                            <div class="game-item" onclick="selectGame('pacman')">
                                <i class="fas fa-ghost"></i>
                                <div>吃豆人</div>
                            </div>
                        </div>
                        
                        <div class="game-status">
                            <div class="game-title">超级马里奥</div>
                            <div class="game-state paused">已暂停</div>
                        </div>
                        
                        <div class="game-screen">
                            <canvas id="gameCanvas" width="256" height="240"></canvas>
                        </div>
                        
                        <div class="game-controls">
                            <button class="game-btn" onclick="toggleGameState()">
                                <i class="fas fa-play"></i> 开始游戏
                            </button>
                            <button class="game-btn secondary" onclick="resetGame()">
                                <i class="fas fa-redo"></i> 重新开始
                            </button>
                            <button class="game-btn secondary" onclick="showControlsInfo()">
                                <i class="fas fa-info-circle"></i> 操作说明
                            </button>
                        </div>
                        
                        <div class="controls-info" style="display: none;">
                            <h3>游戏操作说明</h3>
                            <div class="controls-grid">
                                <div class="control-item">
                                    <div class="key">←</div>
                                    <div>向左移动</div>
                                </div>
                                <div class="control-item">
                                    <div class="key">→</div>
                                    <div>向右移动</div>
                                </div>
                                <div class="control-item">
                                    <div class="key">↑</div>
                                    <div>向上/跳跃</div>
                                </div>
                                <div class="control-item">
                                    <div class="key">↓</div>
                                    <div>向下/蹲下</div>
                                </div>
                                <div class="control-item">
                                    <div class="key">Z</div>
                                    <div>攻击/动作A</div>
                                </div>
                                <div class="control-item">
                                    <div class="key">X</div>
                                    <div>跳跃/动作B</div>
                                </div>
                                <div class="control-item">
                                    <div class="key">Enter</div>
                                    <div>开始游戏</div>
                                </div>
                                <div class="control-item">
                                    <div class="key">ESC</div>
                                    <div>暂停游戏</div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="game-save-section">
                            <h3>游戏存档</h3>
                            <p>选择存档槽位保存或加载游戏进度</p>
                            
                            <div class="save-slots">
                                <div class="save-slot empty" onclick="selectSaveSlot(0)">
                                    <div>存档槽 1</div>
                                    <div class="save-info">空存档</div>
                                </div>
                                <div class="save-slot empty" onclick="selectSaveSlot(1)">
                                    <div>存档槽 2</div>
                                    <div class="save-info">空存档</div>
                                </div>
                                <div class="save-slot empty" onclick="selectSaveSlot(2)">
                                    <div>存档槽 3</div>
                                    <div class="save-info">空存档</div>
                                </div>
                            </div>
                            
                            <div class="game-controls">
                                <button class="game-btn" onclick="saveGame()">
                                    <i class="fas fa-save"></i> 保存游戏
                                </button>
                                <button class="game-btn secondary" onclick="loadGame()">
                                    <i class="fas fa-folder-open"></i> 加载游戏
                                </button>
                            </div>
                        </div>
                    </div>
                `;

            // 初始化游戏画布
            setTimeout(initGame, 100);
            break;
        default:
            modalBody.innerHTML = `<p>该功能正在开发中，敬请期待！</p>`;
    }
    if (needShowModal) {
        modal.style.display = 'block';

    } else {
        needShowModal = true
    }
}

// 关闭模态框
function closeModal() {
    document.getElementById('toolModal').style.display = 'none';
    if (hlsPlayer) {
        hlsPlayer.destroy();
        hlsPlayer = null;
    }
    currentTool = null;
}

// 点击模态框外部关闭
window.onclick = function (event) {
    const modal = document.getElementById('toolModal');
    if (event.target === modal) {
        closeModal();
    }
}