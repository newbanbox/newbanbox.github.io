import os
import re
import requests
import time
from urllib.parse import unquote
import codecs

def extract_nes_paths(text):
    """从文本中提取所有.nes文件路径"""
    # 匹配包含.nes的字符串
    pattern = r"[\w/\x20\-\.\!\(\)\[\]]+\.nes"
    matches = re.findall(pattern, text)
    
    # 处理转义字符（如\x20转换为空格）
    processed_paths = []
    for path in matches:
        # 解码转义序列
        decoded_path = codecs.decode(path, 'unicode_escape')
        processed_paths.append(decoded_path)
    
    return processed_paths

def create_directories(paths):
    """为所有路径创建对应的目录结构"""
    for path in paths:
        # 提取目录部分
        directory = os.path.dirname(path)
        if directory and not os.path.exists(directory):
            os.makedirs(directory, exist_ok=True)
            print(f"创建目录: {directory}")

def download_nes_files(paths, base_url="https://game.xugaoyi.com/"):
    """下载所有NES文件到对应的目录"""
    success_count = 0
    fail_count = 0
    failed_files = []
    
    for i, path in enumerate(paths, 1):
        # 构建完整的URL
        full_url = base_url + path
        
        # 本地文件路径
        local_path = path
        
        print(f"[{i}/{len(paths)}] 正在下载: {path}")
        
        try:
            # 发送HTTP请求
            response = requests.get(full_url, stream=True, timeout=30)
            response.raise_for_status()
            
            # 确保目录存在
            directory = os.path.dirname(local_path)
            if directory and not os.path.exists(directory):
                os.makedirs(directory, exist_ok=True)
            
            # 写入文件
            with open(local_path, 'wb') as f:
                for chunk in response.iter_content(chunk_size=8192):
                    if chunk:
                        f.write(chunk)
            
            file_size = os.path.getsize(local_path)
            print(f"    下载成功! 文件大小: {file_size} 字节")
            success_count += 1
            
        except Exception as e:
            print(f"    下载失败: {str(e)}")
            fail_count += 1
            failed_files.append(path)
        
        # 添加延迟，避免请求过于频繁
        time.sleep(0.5)
    
    return success_count, fail_count, failed_files

def main():
    # 您提供的文本内容
    text = """var a0_0x20be=['roms/rom2/RockinCats.nes','roms/rom2/Life\x20Force\x20[!].nes','roms/wudi/glsc-wx.nes','roms/wudi/mxd-wd.nes','双截龙2','roms/roms-copy/xueren.nes','沙罗曼蛇','超级马里奥(无敌版)','webkitRequestFullscreen','俄罗斯方块LJ65','中国象棋','roms/rom2/1943.nes','active-icon','马里奥医生','requestFullscreen','8197TQJyeq','.fullScreen','马戏团','3ezhzgq','魂斗罗(S弹)','142dHgtQz','坦克\x20(Ch)\x20Tank\x201990','roms/roms-copy/lkr.nes','1943中途岛战役','1224972EQOwoO','.link_btn','location','3043JdjthF','roms/roms-copy/ma.nes','webkitExitFullscreen','魂斗罗(L弹)','三目童子','roms/roms-copy/zhadan.nes','roms/roms-copy/maoxiandao.nes','mozFullScreen','roms/Double\x20Dragon/Double\x20Dragon2.nes','webkitIsFullScreen','撞球咖啡馆','坦克\x20(Ch)\x20Missile\x20Tank','roms/rom1/(J)\x20F-1\x20Race\x20[!].nes','魂斗罗(30命L弹)','roms/bfirsh/Dr.\x20Mario\x20(JU).nes','roms/roms-copy/3.nes','roms/other/Tetris\x202\x20(U)\x20[!].nes','roms/rom1/(W)\x20Wrecking\x20Crew\x20[!].nes','roms/roms-copy/sg1.nes','摩托车大赛','洛克人1','roms/rom1/(J)\x20(V1.2)\x20Yie\x20Ar\x20Kung-Fu\x20[!].nes','22VdNENL','RQCODE','roms/rom1/(JU)\x20Excitebike\x20[!].nes','roms/rom1/(J)\x20Battle\x20City.nes','exitFullscreen','roms/Contra/Contra1(U)M.nes','魂斗罗(30命S弹)','魂斗罗(F弹)','魂斗罗1(U)30','roms/wudi/hdl-wd.nes','(^|&)','roms/roms-copy/rjbq.nes','双截龙4','冒险岛','roms/Contra/Contra1(U)30F.nes','魂斗罗(30命F弹)','roms/rom1/(W)\x20Super\x20Mario\x20Bros.\x20[!].nes','魂斗罗(无敌版)','substr','吃豆精灵','关注「有趣研究社」公众号探索更多...','魂斗罗2(透明无敌版)','addClass','俄罗斯方块2(U)','removeClass','roms/wudi/cjml-wd.nes','影子传说','roms/other/Tetris\x20(U)\x20[!].nes','roms/wudi/mla2-wd.nes','roms/rom2/Shufflepuck\x20Cafe.nes','match','roms/roms-copy/emc.nes','src','icon-fangda','roms/Contra/Contra1(U)30L.nes','329SGlsXl','28411feCBiw','超级马里奥1','hasClass','init','恶魔城1','公路赛车(时间无限)','roms/other/Kage.nes','roms/rom1/Championship\x20Lode\x20Runner\x20(J).nes','fullScreen','纽约大拳猫','roms/rom1/(JU)\x20(PRG0)\x20Mach\x20Rider\x20[!].nes','68918bddXdz','roms/other/Zhong\x20Guo\x20Xiang\x20Qi.nes','roms/lj65/lj65.nes','677592FjLrZA','mozRequestFullScreen','roms/Contra/Contra1(U)S.nes','淘金者(汉化)','roms/rom1/(Ch)\x20Tank\x201990.nes','roms/Contra/Contra1(U)30S.nes','越野机车','body','roms/Contra/Contra1(U)30.nes','click','loadROM','roms/Double\x20Dragon/Double\x20Dragon3.nes','冒险岛(无敌版)','attr','#emulator','roms/wudi/tkdz-wd.nes','炸弹人','icon-suoxiao','双截龙3','roms/wudi/hdl2-wd.nes','roms/rom1/(Ch)\x20Missile\x20Tank.nes','890590cvLbyC','msRequestFullscreen','魂斗罗(30命普通弹)','超级马里奥2','<img\x20src=','roms/rom1/(Hacker)\x20AV\x20Mahjongg.nes','坦克\x20(J)\x20Battle\x20City','https://cdn.jsdelivr.net/gh/xugaoyi/image_store@master/blog/qrcode.zdqv9mlfc0g.jpg','https://mp.weixin.qq.com/s/DSf6KAsZldT6-qlEPDw1Lg','mozCancelFullScreen','JSNESUI'];var a0_0x4cbd13=a0_0x1ce8;(function(_0x3c25a2,_0x43b08d){var _0x3eb8d6=a0_0x1ce8;while(!![]){try{var _0x5d8b93=-parseInt(_0x3eb8d6(0xf9))*-parseInt(_0x3eb8d6(0xf4))+parseInt(_0x3eb8d6(0xf7))*parseInt(_0x3eb8d6(0xc2))+-parseInt(_0x3eb8d6(0x93))*parseInt(_0x3eb8d6(0xb7))+-parseInt(_0x3eb8d6(0xda))+parseInt(_0x3eb8d6(0xfd))+parseInt(_0x3eb8d6(0xc5))+-parseInt(_0x3eb8d6(0xb6))*parseInt(_0x3eb8d6(0x7d));if(_0x5d8b93===_0x43b08d)break;else _0x3c25a2['push'](_0x3c25a2['shift']());}catch(_0x120c13){_0x3c25a2['push'](_0x3c25a2['shift']());}}}(a0_0x20be,0xb8b21));function a0_0x1ce8(_0x576ca4,_0x4bf3e7){return a0_0x1ce8=function(_0x20be74,_0x1ce8a7){_0x20be74=_0x20be74-0x7d;var _0x587cf0=a0_0x20be[_0x20be74];return _0x587cf0;},a0_0x1ce8(_0x576ca4,_0x4bf3e7);}var LINT_GAME_LIST=[[a0_0x4cbd13(0xb8),a0_0x4cbd13(0xa3)],[a0_0x4cbd13(0x9b),a0_0x4cbd13(0xcd)],[a0_0x4cbd13(0x88),a0_0x4cbd13(0xd9)],['冒险岛',a0_0x4cbd13(0x83)]],game_index=getUrlParam(a0_0x4cbd13(0xba)),LINT_GAME=game_index?LINT_GAME_LIST[game_index]:LINT_GAME_LIST[0x0],QR_CODE=a0_0x4cbd13(0xe1),LINK=a0_0x4cbd13(0xe2),GAMES={'热门游戏':[LINT_GAME],'超级玛丽':[[a0_0x4cbd13(0xec),a0_0x4cbd13(0xac)],['超级马里奥2(无敌版)',a0_0x4cbd13(0xaf)],[a0_0x4cbd13(0xb8),a0_0x4cbd13(0xa3)],[a0_0x4cbd13(0xdd),'roms/bfirsh/Super\x20Mario\x20Bros.\x203\x20(U)\x20(PRG1)\x20[!].nes'],['马里奥拆屋工',a0_0x4cbd13(0x8e)],[a0_0x4cbd13(0xf2),a0_0x4cbd13(0x8b)]],'魂斗罗':[[a0_0x4cbd13(0xa4),a0_0x4cbd13(0x9c)],[a0_0x4cbd13(0xa8),a0_0x4cbd13(0xd8)],[a0_0x4cbd13(0xdc),a0_0x4cbd13(0xcd)],[a0_0x4cbd13(0xa2),a0_0x4cbd13(0xa1)],[a0_0x4cbd13(0x8a),a0_0x4cbd13(0xb5)],['魂斗罗(30命M弹)','roms/Contra/Contra1(U)30M.nes'],[a0_0x4cbd13(0x99),a0_0x4cbd13(0xca)],[a0_0x4cbd13(0x9a),'roms/Contra/Contra1(U)F.nes'],[a0_0x4cbd13(0x80),'roms/Contra/Contra1(U)L.nes'],['魂斗罗(M弹)',a0_0x4cbd13(0x98)],[a0_0x4cbd13(0xf8),a0_0x4cbd13(0xc7)]],'赛车':[['F1赛车',a0_0x4cbd13(0x89)],[a0_0x4cbd13(0xbc),a0_0x4cbd13(0xe7)],[a0_0x4cbd13(0x90),a0_0x4cbd13(0xc1)],[a0_0x4cbd13(0xcb),a0_0x4cbd13(0x95)],['火箭车','roms/rom1/(J)\x20Road\x20Fighter\x20[!].nes']],'冒险岛':[[a0_0x4cbd13(0xd1),a0_0x4cbd13(0xe8)],[a0_0x4cbd13(0xa0),a0_0x4cbd13(0x83)]],'双截龙':[['双截龙1','roms/Double\x20Dragon/Double\x20Dragon1.nes'],[a0_0x4cbd13(0xe9),a0_0x4cbd13(0x85)],[a0_0x4cbd13(0xd7),a0_0x4cbd13(0xd0)],[a0_0x4cbd13(0x9f),'roms/Double\x20Dragon/Double\x20Dragon4.nes']],'坦克':[['坦克大战-无敌版',a0_0x4cbd13(0xd4)],[a0_0x4cbd13(0x88),a0_0x4cbd13(0xd9)],[a0_0x4cbd13(0xfa),a0_0x4cbd13(0xc9)],[a0_0x4cbd13(0xe0),a0_0x4cbd13(0x96)]],'俄罗斯方块':[[a0_0x4cbd13(0xee),a0_0x4cbd13(0xc4)],['俄罗斯方块(U)',a0_0x4cbd13(0xae)],[a0_0x4cbd13(0xaa),a0_0x4cbd13(0x8d)]],'淘金者':[[a0_0x4cbd13(0xc8),'roms/rom1/TaoJinZhe.nes'],['淘金者(J)',a0_0x4cbd13(0xbe)]],'更多游戏':[['AV麻雀俱乐部',a0_0x4cbd13(0xdf)],[a0_0x4cbd13(0xc0),a0_0x4cbd13(0xe5)],['赤影战士',a0_0x4cbd13(0xbd)],[a0_0x4cbd13(0xef),a0_0x4cbd13(0xc3)],[a0_0x4cbd13(0xa6),'roms/other/Pac-Man.nes'],[a0_0x4cbd13(0xeb),a0_0x4cbd13(0xe6)],[a0_0x4cbd13(0xfc),a0_0x4cbd13(0xf0)],['脱狱','roms/rom2/Cross\x20Fire\x20(J).nes'],[a0_0x4cbd13(0x87),a0_0x4cbd13(0xb0)],['功夫',a0_0x4cbd13(0x92)],['雪人兄弟',a0_0x4cbd13(0xea)],[a0_0x4cbd13(0xd5),a0_0x4cbd13(0x82)],[a0_0x4cbd13(0xf6),a0_0x4cbd13(0x7e)],[a0_0x4cbd13(0xad),'roms/roms-copy/Kage.nes'],[a0_0x4cbd13(0x81),a0_0x4cbd13(0x8c)],[a0_0x4cbd13(0xbb),a0_0x4cbd13(0xb2)],[a0_0x4cbd13(0x91),a0_0x4cbd13(0xfb)],['人间兵器',a0_0x4cbd13(0x9e)],['忍者神龟1',a0_0x4cbd13(0x8f)],['激龟快打','roms/roms-copy/sg4.nes'],['泡泡龙2','roms/roms-copy/ppl2.nes'],['西游记1','roms/roms-copy/xyj1.nes'],[a0_0x4cbd13(0xa7),a0_0x4cbd13(0x94)]]},nes;$(function(){var _0x4abe9b=a0_0x4cbd13,_0x475dbe=$('.qr-code\x20img'),_0x339aca=$(_0x4abe9b(0xfe));if(!_0x475dbe['length']||!_0x339aca['length']){$(_0x4abe9b(0xcc))['html'](_0x4abe9b(0xde)+QR_CODE+'>');return;}_0x475dbe[_0x4abe9b(0xd2)](_0x4abe9b(0xb3),QR_CODE),_0x339aca[_0x4abe9b(0xd2)]('href',LINK),nes=new JSNES({'ui':$(_0x4abe9b(0xd3))[_0x4abe9b(0xe4)](GAMES)}),nes['ui'][_0x4abe9b(0xcf)](LINT_GAME[0x1]),$(_0x4abe9b(0xf5))[_0x4abe9b(0xce)](function(_0x327bff){var _0x5885c0=_0x4abe9b;$(this)[_0x5885c0(0xb9)](_0x5885c0(0xb4))?$(this)[_0x5885c0(0xa9)](_0x5885c0(0xd6))[_0x5885c0(0xa9)](_0x5885c0(0xf1))['removeClass'](_0x5885c0(0xb4)):$(this)['addClass'](_0x5885c0(0xb4))['removeClass'](_0x5885c0(0xf1))[_0x5885c0(0xab)](_0x5885c0(0xd6)),FullScreen(document[_0x5885c0(0xcc)]);});});function FullScreen(_0x278536){var _0x236601=a0_0x4cbd13,_0x19e8c2=document[_0x236601(0xbf)]||document[_0x236601(0x84)]||document[_0x236601(0x86)];!_0x19e8c2?_0x278536[_0x236601(0xf3)]&&_0x278536[_0x236601(0xf3)]()||_0x278536[_0x236601(0xc6)]&&_0x278536[_0x236601(0xc6)]()||_0x278536['webkitRequestFullscreen']&&_0x278536[_0x236601(0xed)]()||_0x278536[_0x236601(0xdb)]&&_0x278536[_0x236601(0xdb)]():document[_0x236601(0x97)]?document['exitFullscreen']():document[_0x236601(0xe3)]?document[_0x236601(0xe3)]():document[_0x236601(0x7f)]?document[_0x236601(0x7f)]():'';}function getUrlParam(_0x4eca0a){var _0x4fd681=a0_0x4cbd13,_0x1d96db=new RegExp(_0x4fd681(0x9d)+_0x4eca0a+'=([^&]*)(&|$)'),_0x5801d8=window[_0x4fd681(0xff)]['search'][_0x4fd681(0xa5)](0x1)[_0x4fd681(0xb1)](_0x1d96db);if(_0x5801d8!=null)return unescape(_0x5801d8[0x2]);return null;}"""
    
    print("开始提取.nes文件路径...")
    nes_paths = extract_nes_paths(text)
    
    print(f"找到 {len(nes_paths)} 个.nes文件路径:")
    for path in nes_paths:
        print(f"  {path}")
    
    print("\n开始创建目录结构...")
    create_directories(nes_paths)
    
    print("\n开始下载文件...")
    success, fail, failed_files = download_nes_files(nes_paths)
    
    print(f"\n下载完成!")
    print(f"成功: {success} 个文件")
    print(f"失败: {fail} 个文件")
    
    if failed_files:
        print("\n失败的文件列表:")
        for file in failed_files:
            print(f"  {file}")

if __name__ == "__main__":
    main()
