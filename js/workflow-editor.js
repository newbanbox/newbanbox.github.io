/************************
*
*    工作流编辑器
*
**************************/
let workflowViewer = null;
// 初始化工作流编辑器
function initWorkflowEditor() {
    const canvas = document.getElementById('workflow-canvas');

    // 使用BPMN.js创建工作流编辑器
    workflowViewer = new BpmnJS({
        container: canvas
    });

    // 创建一个简单的工作流示例
    const initialDiagram = `
        <?xml version="1.0" encoding="UTF-8"?>
        <bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" id="Definitions_1" targetNamespace="http://bpmn.io/schema/bpmn">
          <bpmn:process id="Process_1" isExecutable="false">
            <bpmn:startEvent id="StartEvent_1">
              <bpmn:outgoing>Flow_1</bpmn:outgoing>
            </bpmn:startEvent>
            <bpmn:task id="Task_1">
              <bpmn:incoming>Flow_1</bpmn:incoming>
              <bpmn:outgoing>Flow_2</bpmn:outgoing>
            </bpmn:task>
            <bpmn:endEvent id="EndEvent_1">
              <bpmn:incoming>Flow_2</bpmn:incoming>
            </bpmn:endEvent>
            <bpmn:sequenceFlow id="Flow_1" sourceRef="StartEvent_1" targetRef="Task_1" />
            <bpmn:sequenceFlow id="Flow_2" sourceRef="Task_1" targetRef="EndEvent_1" />
          </bpmn:process>
          <bpmndi:BPMNDiagram id="BPMNDiagram_1">
            <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">
              <bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1">
                <dc:Bounds x="173" y="102" width="36" height="36" />
              </bpmndi:BPMNShape>
              <bpmndi:BPMNShape id="Task_1_di" bpmnElement="Task_1">
                <dc:Bounds x="280" y="80" width="100" height="80" />
              </bpmndi:BPMNShape>
              <bpmndi:BPMNShape id="EndEvent_1_di" bpmnElement="EndEvent_1">
                <dc:Bounds x="450" y="102" width="36" height="36" />
              </bpmndi:BPMNShape>
              <bpmndi:BPMNEdge id="Flow_1_di" bpmnElement="Flow_1">
                <di:waypoint x="209" y="120" />
                <di:waypoint x="280" y="120" />
              </bpmndi:BPMNEdge>
              <bpmndi:BPMNEdge id="Flow_2_di" bpmnElement="Flow_2">
                <di:waypoint x="380" y="120" />
                <di:waypoint x="450" y="120" />
              </bpmndi:BPMNEdge>
            </bpmndi:BPMNPlane>
          </bpmndi:BPMNDiagram>
        </bpmn:definitions>
    `;

    workflowViewer.importXML(initialDiagram, function (err) {
        if (err) {
            console.error('Failed to import BPMN diagram', err);
        } else {
            console.log('BPMN diagram imported successfully');
        }
    });

    // 添加拖拽功能
    setupWorkflowDragAndDrop();
}

// 设置工作流拖拽功能
function setupWorkflowDragAndDrop() {
    const tools = document.querySelectorAll('.workflow-tool');

    tools.forEach(tool => {
        tool.addEventListener('dragstart', function (e) {
            e.dataTransfer.setData('text/plain', e.target.dataset.type);
        });
    });

    const canvas = document.getElementById('workflow-canvas');
    canvas.addEventListener('dragover', function (e) {
        e.preventDefault();
    });

    canvas.addEventListener('drop', function (e) {
        e.preventDefault();
        const type = e.dataTransfer.getData('text/plain');
        alert(`添加了 ${type} 节点到工作流中。在实际应用中，这里会实现完整的BPMN节点添加逻辑。`);
    });
}

// 保存工作流
function saveWorkflow() {
    const workflowName = document.getElementById('workflowName').value;
    if (!workflowName) {
        alert('请输入工作流名称');
        return;
    }

    workflowViewer.saveXML({ format: true }, function (err, xml) {
        if (err) {
            console.error('Failed to save workflow', err);
            alert('保存工作流失败');
        } else {
            // 在实际应用中，这里会将XML保存到服务器或本地存储
            localStorage.setItem(`workflow_${workflowName}`, xml);
            alert(`工作流 "${workflowName}" 已保存成功！`);
        }
    });
}

// 导出工作流
function exportWorkflow() {
    workflowViewer.saveXML({ format: true }, function (err, xml) {
        if (err) {
            console.error('Failed to export workflow', err);
            alert('导出工作流失败');
        } else {
            const blob = new Blob([xml], { type: 'application/xml' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'workflow.bpmn';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
    });
}

// 执行工作流
function executeWorkflow() {
    document.getElementById('executionResult').style.display = 'block';
    document.getElementById('resultContent').innerHTML = `
        <p>工作流执行中...</p>
        <div class="progress-container">
            <div class="progress-bar" style="width: 0%"></div>
        </div>
        <ul>
            <li>开始事件: 执行中</li>
            <li>任务1: 等待中</li>
            <li>结束事件: 等待中</li>
        </ul>
    `;

    // 模拟工作流执行过程
    let progress = 0;
    const interval = setInterval(() => {
        progress += 20;
        document.querySelector('.progress-bar').style.width = `${progress}%`;

        if (progress >= 100) {
            clearInterval(interval);
            document.getElementById('resultContent').innerHTML = `
                <p>工作流执行完成！</p>
                <ul>
                    <li>开始事件: 已完成</li>
                    <li>任务1: 已完成</li>
                    <li>结束事件: 已完成</li>
                </ul>
                <p>总执行时间: 5秒</p>
                <p>状态: 成功</p>
            `;
        }
    }, 1000);
}

