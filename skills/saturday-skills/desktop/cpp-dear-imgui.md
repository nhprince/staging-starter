# C++ Dear ImGui Expert SKILL

## When to Use This Skill
Use when building tools, editors, debug UIs, or game tools with C++.

## Core Knowledge

### Setup
```cmake
# CMakeLists.txt
cmake_minimum_required(VERSION 3.16)
project(MyApp)

# Dear ImGui
add_subdirectory(third_party/imgui)

add_executable(MyApp main.cpp)
target_link_libraries(MyApp imgui glfw opengl32)
```

### Basic Window
```cpp
// main.cpp
#include "imgui.h"
#include "imgui_impl_glfw.h"
#include "imgui_impl_opengl3.h"

int main() {
    // Init GLFW + OpenGL
    glfwInit();
    GLFWwindow* window = glfwCreateWindow(1280, 720, "MyApp", NULL, NULL);
    
    // Init ImGui
    IMGUI_CHECKVERSION();
    ImGui::CreateContext();
    ImGui_ImplGlfw_InitForOpenGL(window, true);
    ImGui_ImplOpenGL3_Init("#version 130");
    
    // Main loop
    while (!glfwWindowShouldClose(window)) {
        ImGui_ImplOpenGL3_NewFrame();
        ImGui_ImplGlfw_NewFrame();
        ImGui::NewFrame();
        
        // UI
        ImGui::Begin("Hello");
        ImGui::Text("FPS: %.1f", ImGui::GetIO().Framerate);
        if (ImGui::Button("Click")) { /* action */ }
        ImGui::End();
        
        // Render
        ImGui::Render();
        ImGui_ImplOpenGL3_RenderDrawData(ImGui::GetDrawData());
    }
}
```

### Backends
- **OpenGL3 + GLFW** — Easiest, cross-platform
- **DirectX11** — Windows-only, best performance
- **Vulkan** — Cross-platform, modern

## Common Pitfalls
1. **Memory management** — C++ has no GC; use smart pointers
2. **Build complexity** — Use CMake for cross-platform builds
3. **No hot reload** — Recompile for every change

## Verification Checklist
- [ ] CMake project builds
- [ ] Window renders with ImGui
- [ ] Input handling works
- [ ] Cross-platform compilation
