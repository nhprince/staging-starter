# .NET Avalonia Expert SKILL

## When to Use This Skill
Use when building cross-platform desktop apps with .NET and Avalonia UI.

## Core Knowledge

### Setup
```bash
# Install .NET SDK
curl -sSL https://dot.net/v1/dotnet-install.sh | bash /dev/stdin --channel 9.0
export PATH="$PATH:$HOME/.dotnet"

# Install Avalonia templates
dotnet new install Avalonia.Templates

# Create project
dotnet new avalonia.mvvm -n MyApp
```

### MVVM Pattern
```csharp
// ViewModels/MainViewModel.cs
public class MainViewModel : ViewModelBase
{
    private string _name = "";
    public string Name
    {
        get => _name;
        set => this.RaiseAndSetIfChanged(ref _name, value);
    }

    public string Greeting => $"Hello, {Name}!";
}

// Views/MainWindow.xaml
<Window xmlns="https://github.com/avaloniaui"
        Title="MyApp" Width="400" Height="300">
    <StackPanel Margin="20">
        <TextBox Text="{Binding Name}" Watermark="Enter name"/>
        <TextBlock Text="{Binding Greeting}" Margin="0,10"/>
    </StackPanel>
</Window>
```

### Platforms
- Windows, macOS, Linux, WebAssembly
- Single codebase for all platforms

## Common Pitfalls
1. **Not using MVVM** — Code-behind is harder to test
2. **Missing ReactiveUI** — Use for reactive bindings
3. **Large runtime** — .NET runtime adds ~50MB to bundle

## Verification Checklist
- [ ] Project builds with `dotnet build`
- [ ] MVVM pattern followed
- [ ] App runs on target platforms
