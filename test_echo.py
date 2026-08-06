from playwright.sync_api import sync_playwright

def test_echo_page():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        
        print("正在测试跟读页面...")
        
        # 访问跟读页面
        page.goto('http://localhost:3030/echo')
        page.wait_for_load_state('networkidle')
        
        # 检查页面标题
        title = page.title()
        print(f"页面标题: {title}")
        
        # 检查主要元素
        header = page.locator('h1:has-text("跟读时光")')
        if header.is_visible():
            print("✓ 标题 '跟读时光' 可见")
        
        # 检查输入区域
        textarea = page.locator('textarea')
        if textarea.is_visible():
            print("✓ 文本输入区域可见")
            # 获取输入框的默认文本
            default_text = textarea.input_value()
            print(f"✓ 默认文本长度: {len(default_text)} 字符")
        
        # 检查开始按钮
        start_button = page.locator('button:has-text("开始跟读")')
        if start_button.is_visible():
            print("✓ '开始跟读' 按钮可见")
            start_button.click()
            print("点击了开始跟读按钮")
            
            # 等待页面切换到阅读模式
            page.wait_for_timeout(500)
            
            # 检查播放按钮
            play_button = page.locator('button[title="重置"]').locator('..').locator('button').last
            if play_button.is_visible():
                print("✓ 播放/暂停按钮可见")
                
                # 点击播放
                play_button.click()
                print("✓ 播放按钮已点击")
                
                # 等待几秒钟，观察文字滚动
                page.wait_for_timeout(2000)
                print("✓ 等待2秒，观察文字滚动效果")
                
                # 再次点击暂停
                play_button.click()
                print("✓ 暂停按钮已点击")
                
                # 检查重置按钮
                reset_button = page.locator('button[title="重置"]')
                if reset_button.is_visible():
                    print("✓ 重置按钮可见")
                    
        # 截图保存
        page.screenshot(path='/tmp/echo-page-test.png', full_page=True)
        print("✓ 截图已保存到 /tmp/echo-page-test.png")
        
        # 检查控制台错误
        console_errors = []
        page.on('console', lambda msg: console_errors.append(msg.text) if msg.type == 'error' else None)
        page.wait_for_timeout(1000)
        
        if console_errors:
            print(f"发现 {len(console_errors)} 个控制台错误:")
            for error in console_errors:
                print(f"  - {error}")
        else:
            print("✓ 没有控制台错误")
        
        browser.close()
        print("\n测试完成！")

if __name__ == '__main__':
    test_echo_page()
