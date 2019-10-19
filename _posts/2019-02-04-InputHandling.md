---
layout: post
title:  "Handling Player Input"
date:   2019-02-04
tags: input handling, input, gamedev, accessibility
permalink: /blog/:year/:month/:day/:title/
author: AJ Weeks
---

As I've added more and more game mechanics to <a class="underline" href="https://ajweeks.com/FlexEngine">Flex</a>, I've experimented with different input methods a player can use to interact with the world besides the typical 'Press E to interact' (spinning a valve by <a class="underline" href="https://www.youtube.com/watch?v=_6wftcZg1jg">rotating a joystick</a> is one alternative method). So far I've added support for keyboard, mouse, and XBOX controllers, but I will likely further expand the number of supported devices in the future (midi keyboards anyone?). The code I have been using to handle each input method is quite messy and needed to be cleaned up. This post will cover the process I went through to get where I'm at today with the system.

To see why I felt this change was necessary, take a look at how I was checking for a jump input:

```c++
if (g_InputManager->IsGamepadButtonPressed(m_Index, GamepadButton::A) ||
    (g_InputManager->bPlayerUsingKeyboard[m_Index] &&
     g_InputManager->GetKeyPressed(KeyCode::KEY_SPACE)))
{
    // ...
}
```

Clearly not good in a number of ways:

**1.** **The player can not edit keybindings**. This is the _first_ item on the "basic" category on the great <a class="underline" href="http://gameaccessibilityguidelines.com/">Game Accessibility Guidelines</a>, so I'd say it's a necessary feature to have if you have any desire to cater toward disabled gamers, plus it's a useful feature for able gamers alike.

**2.** That's simply **too much code** for catching an action event, and it will only grow longer as more input methods are added. This will inevitably lead to typos and copy-paste errors.

**3.** **Single events could be handled multiple times** by different systems leading to, for example, the player walking forward when 'W' was pressed, even when a text box showing above the play area already handled the keypress.

#### Abstraction
To get around the first two issues noted above, we can add a layer of abstraction between the usage code and the input events. (It's the <a class="underline" href="https://en.wikipedia.org/wiki/Fundamental_theorem_of_software_engineering">Fundamental theorem of software engineering</a> after all!)

Once a mapping exists between game-specific-actions (like <code class="inline">MOVE_FORWARD</code> and <code class="inline">INTERACT</code>) and inputs (like <code class="inline">KeyCode::KEY_W</code> and <code class="inline">GamepadButton::A</code>), the usage code can be simplified to just check for an <code class="inline">Action</code> and players will be able to remap keys as they like.

To implement this mapping, I created an enumeration which defines all possible actions that can be taken in-game. I also created an <code class="inline">InputBinding</code> struct which holds all necessary info about which actual inputs each action maps to. The mapping process is then simply indexing into the list using an <code class="inline">Action</code> as the index.

```c++
enum class Action
{
  MOVE_LEFT,
  MOVE_RIGHT,
  MOVE_FORWARD,
  MOVE_BACKWARD,
  INTERACT,
  // ...
  _NONE
};

struct InputBinding
{
  KeyCode keyCode = KeyCode::_NONE;
  MouseButton mouseButton = MouseButton::_NONE;
  MouseAxis mouseAxis = MouseAxis::_NONE;
  GamepadButton gamepadButton = GamepadButton::_NONE;
  GamepadAxis gamepadAxis = GamepadAxis::_NONE;
  bool bNegative = false;
};

InputBinding m_InputBindings[(i32)Action::_NONE + 1];
```

Now, rather than that mess shown earlier, we can catch jump event as follows:

```c++
if (g_InputManager->GetActionPressed(Action::JUMP))
{
    // ...
}
```

For the curious, see how <code class="inline">GetActionPressed</code> is implemented <a class="underline" href="https://gist.github.com/ajweeks/49179473bd576aa669cc88fd06848ed3">here</a>.

This system addresses the first two issues noted above, but to solve the third problem (event handling duplication) we'll need go deeper.

#### Callbacks
In order to allow one system to "consume" an event, thereby preventing other systems from also handling it, I added a callback system for each event type.

To allow an event caller to call member functions on miscellaneous types, I created an abstract class that contains one virtual function. The event caller can maintain a list of listeners using this abstract type, and call the function without knowing anything about the subclass that implements it and keeps a reference to the object which the member function should be called on. The syntax is a little strange, but it works.

```c++
enum class EventReply
{
  CONSUMED,
  UNCONSUMED
};

class ICallbackMouseButton
{
public:
  virtual EventReply Execute(MouseButton button, KeyAction action) = 0;
};

template<typename T>
class MouseButtonEventCallback : public ICallbackMouseButton
{
public:
  using CallbackFunction = EventReply(T::*)(MouseButton, KeyAction);

  MouseButtonEventCallback(T* obj, CallbackFunction fun) :
    mObject(obj),
    mFunction(fun)
  {
  }

  virtual EventReply Execute(MouseButton button, KeyAction action) override
  {
    return (mObject->*mFunction)(button, action);
  }
private:
  CallbackFunction mFunction;
  T* mObject;
};
```

The trickiest part about that code was the <code class="inline">using</code> declaration syntax, but luckily I know a <a class="underline" href="https://twitter.com/simon_coenen">template wizard</a> who helped me out.

I defined similar classes for mouse move & keyboard events, but I'll leave them out for the sake of brevity.

To register a callback, a system has to define a function matching the signature of the callback, as well as an instance of the subclassed callback object. This instance takes the type of the listener as a template argument, which is how it's able to call the member function you point it towards.

```c++
EventReply OnMouseButtonEvent(MouseButton button, KeyAction action);
MouseButtonEventCallback<DebugCamera> mouseButtonCallback;
```

Because the callback object has no default constructor you must initialize it in the constructor of the listener. You must also bind and unbind at the appropriate times:

```c++
DebugCamera::DebugCamera() :
  mouseButtonCallback(this, &DebugCamera::OnMouseButtonEvent)
{
}

void DebugCamera::Initialize()
{
  g_InputManager->BindMouseButtonEventCallback(&mouseButtonCallback);
}

void DebugCamera::Destroy()
{
  g_InputManager->UnbindMouseButtonEventCallback(&mouseButtonCallback);
}

EventReply DebugCamera::OnMouseButtonEvent(MouseButton button, KeyAction action)
{
  if (button == MouseButton::LEFT && action == KeyAction::PRESS)
  {
    // ...
    return EventReply::CONSUMED;
  }
  return EventReply::UNCONSUMED;
}
```

The binding/unbinding functions simply add and remove entries into the list of listeners.

```c++
std::vector<ICallbackMouseButton*> m_MouseButtonCallbacks;
```

When an event is generated, the event caller can iterate over the listeners until one listener consumes it, at which point the propagation stops.

```c++
// Called by OS callback on mouse button press
void InputManager::MouseButtonCallback(MouseButton mouseButton,
  KeyAction action, i32 mods)
{
  // ...

  for (auto iter = m_MouseButtonCallbacks.rbegin();
       iter != m_MouseButtonCallbacks.rend();
       ++iter)
  {
    if ((*iter)->Execute(mouseButton, action) == EventReply::CONSUMED)
    {
      break;
    }
  }
}
```

This system nicely handles the third issue I noted at the start, but it ignores the first issue! To solve all three, I added yet another callback, this time for <code class="inline">Action</code> events. Determining when to call these took a bit of fiddling, especially since I wanted to keep the other callbacks. This was made more complex by the priority system I had since added which determines the order in which the callbacks are called. Priority is determined simply by an integer specified at event bind-time. (<a class="underline" href="https://github.com/ajweeks/FlexEngine/commit/7ccf1d00dc0961ac08fd9af5f516cb9ec8b44a52#diff-1b7a63e8c012c6ad34c6d9677f5b0781">diff</a>) You can find the code in its entirety on <a class="underline" href="https://github.com/ajweeks/FlexEngine/commits/development">GitHub</a> if you'd like to dig through it further.

#### Conclusion

I would prefer to be able to store the callback objects in the event caller classes so that each listener doesn't require an extra member, but I don't believe that's possible without a reflection system (which I'm not keen enough on to bother implementing). Maybe one of these days someone will release a <a class="underline" href="https://github.com/BSVino/JaiPrimer/blob/master/JaiPrimer.md">decent programming language with reflection support...</a>

While implementing this system I was very wary of compile times, and knowing that templates and modern C++ classes are <a class="underline" href="https://zeuxcg.org/2019/01/17/is-c-fast/">known</a> for being slow in several senses, I tried to keep things as simple as I could. However, I think there's still some work to be done in that regard. With that said, this system feels like a big step forward and I've been really enjoying cleaning up the old code to use it.
