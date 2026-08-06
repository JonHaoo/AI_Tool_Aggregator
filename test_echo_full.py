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
            print("✓ 点击了开始跟读按钮")
            
            # 等待页面切换到阅读模式
            page.wait_for_timeout(1000)
            
            # 检查是否进入了阅读模式
            progress = page.locator('text=第 1 /')
            if progress.is_visible():
                print("✓ 进入了阅读模式，显示进度")
            else:
                print("✗ 未进入阅读模式")
            
            # 查找播放按钮（中心的大按钮）
            play_button = page.locator('.pulse-glow').first
            if play_button.count() > 0:
                print("✓ 找到播放按钮")
                play_button.click()
                print("✓ 点击了播放按钮")
                
                # 等待2秒，观察文字滚动
                page.wait_for_timeout(2000)
                print("✓ 等待2秒，观察文字滚动效果")
                
                # 检查进度是否更新
                progress_text = page.locator('span:has-text("%")').first
                if progress_text.is_visible():
                    progress_value = progress_text.text_content()
                    print(f"✓ 当前进度: {progress_value}")
                
                # 再次点击暂停
                play_button.click()
                print("✓ 点击了暂停按钮")
                
                # 检查重置按钮
                reset_button = page.locator('button[title="重置"]')
                if reset_button.is_visible():
                    print("✓ 重置按钮可见")
                    reset_button.click()
                    print("✓ 点击了重置按钮")
                    
                    # 等待重置
                    page.wait_for_timeout(500)
                    
                    # 检查是否回到开始
                    progress_after_reset = page.locator('text=第 1 /')
                    if progress_after_reset.is_visible():
                        print("✓ 重置成功，回到第1段")
            
            # 检查编辑文本按钮
            edit_button = page.locator('button:has-text("编辑文本")')
            if edit_button.is_visible():
                print("✓ '编辑文本' 按钮可见")
                edit_button.click()
                print("✓ 点击了编辑文本按钮")
                
                # 检查是否回到输入模式
                page.wait_for_timeout(500)
                if textarea.is_visible():
                    print("✓ 成功回到输入模式")
            
        # 截图保存
        page.screenshot(path='/tmp/echo-page-test-full.png', full_page=True)
        print("✓ 截图已保存到 /tmp/echo-page-test-full.png")
        
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
        print("\n✅ 所有测试完成！")

if __name__ == '__main__':
    test_echo_page()
