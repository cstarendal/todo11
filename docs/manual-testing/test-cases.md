# Manual Test Cases - Task App

## 🧪 Test Case Categories

### TC-001: Task Creation Flow
**Objective**: Verify CreateTaskUseCase integration and form functionality

#### TC-001.1: Valid Task Creation
**Priority**: Critical  
**Estimated Time**: 2 minutes

**Pre-conditions**:
- Demo app loaded at `http://localhost:3000`
- Task list is empty or has existing tasks

**Test Steps**:
1. Locate the task creation form
2. Enter "Buy groceries" in the title field
3. Enter "Milk, bread, eggs" in the description field
4. Click "Create Task" button
5. Observe the task list

**Expected Results**:
- ✅ Form submits without errors
- ✅ New task appears in the task list
- ✅ Task shows title "Buy groceries"
- ✅ Task shows description "Milk, bread, eggs"
- ✅ Task status is "incomplete" (unchecked)
- ✅ Form fields are cleared after submission
- ✅ No console errors

**Performance Target**: < 500ms from click to task display

---

#### TC-001.2: Empty Title Validation
**Priority**: High  
**Estimated Time**: 1 minute

**Test Steps**:
1. Leave title field empty
2. Enter description (optional)
3. Click "Create Task" button

**Expected Results**:
- ✅ Form validation prevents submission
- ✅ Error message displayed for title field
- ✅ Description field retains content
- ✅ No task added to list

---

#### TC-001.3: Description Optional
**Priority**: Medium  
**Estimated Time**: 1 minute

**Test Steps**:
1. Enter "Quick task" in title field
2. Leave description field empty
3. Click "Create Task" button

**Expected Results**:
- ✅ Task created successfully
- ✅ Task shows only title in list
- ✅ No description section visible

---

### TC-002: Task Toggle Flow
**Objective**: Verify ToggleTaskUseCase integration and state management

#### TC-002.1: Complete Task
**Priority**: Critical  
**Estimated Time**: 1 minute

**Pre-conditions**:
- At least one incomplete task exists in the list

**Test Steps**:
1. Identify an incomplete task (unchecked)
2. Click on the task item
3. Observe visual changes

**Expected Results**:
- ✅ Task status changes to complete (checked)
- ✅ Visual styling updates (strikethrough, different color)
- ✅ Task remains in list
- ✅ Change is immediate (< 200ms)

---

#### TC-002.2: Uncomplete Task
**Priority**: Critical  
**Estimated Time**: 1 minute

**Pre-conditions**:
- At least one completed task exists in the list

**Test Steps**:
1. Identify a completed task (checked)
2. Click on the task item
3. Observe visual changes

**Expected Results**:
- ✅ Task status changes to incomplete (unchecked)
- ✅ Visual styling reverts to normal
- ✅ Task remains in list
- ✅ Change is immediate (< 200ms)

---

### TC-003: User Interface & Experience
**Objective**: Verify UI responsiveness and user experience

#### TC-003.1: Responsive Design - Mobile
**Priority**: Medium  
**Estimated Time**: 3 minutes

**Test Steps**:
1. Open Developer Tools
2. Switch to mobile view (375x812)
3. Test all functionality from TC-001 and TC-002

**Expected Results**:
- ✅ Form remains usable on mobile
- ✅ Task list displays properly
- ✅ Buttons are touch-friendly (min 44px)
- ✅ Text is readable without zooming

---

#### TC-003.2: Keyboard Navigation
**Priority**: Medium  
**Estimated Time**: 2 minutes

**Test Steps**:
1. Use Tab key to navigate form
2. Use Enter key to submit form
3. Use Space/Enter to toggle tasks

**Expected Results**:
- ✅ All interactive elements are focusable
- ✅ Focus indicators are visible
- ✅ Keyboard shortcuts work
- ✅ Tab order is logical

---

### TC-004: Error Handling & Edge Cases
**Objective**: Verify robust error handling

#### TC-004.1: Rapid Form Submission
**Priority**: Medium  
**Estimated Time**: 2 minutes

**Test Steps**:
1. Fill out form
2. Click submit button multiple times rapidly
3. Observe behavior

**Expected Results**:
- ✅ No duplicate tasks created
- ✅ Form submits only once
- ✅ UI remains responsive

---

#### TC-004.2: Long Text Handling
**Priority**: Low  
**Estimated Time**: 2 minutes

**Test Steps**:
1. Enter very long title (500+ characters)
2. Enter very long description (1000+ characters)
3. Submit form

**Expected Results**:
- ✅ Text truncates or wraps gracefully
- ✅ Layout doesn't break
- ✅ Task remains functional

---

### TC-005: Performance & Load
**Objective**: Verify performance under load

#### TC-005.1: Multiple Tasks Performance
**Priority**: Medium  
**Estimated Time**: 5 minutes

**Test Steps**:
1. Create 50+ tasks rapidly
2. Toggle multiple tasks
3. Monitor performance

**Expected Results**:
- ✅ UI remains responsive
- ✅ Toggle operations < 200ms each
- ✅ No memory leaks observed
- ✅ Smooth scrolling in task list

---

## 📊 Test Results Template

```markdown
## Test Execution Report - [Date]

**Tester**: [Name]  
**Browser**: [Browser & Version]  
**Environment**: [Local/Demo]  

### Results Summary
- **Total Test Cases**: X
- **Passed**: X
- **Failed**: X
- **Blocked**: X
- **Not Executed**: X

### Failed Test Cases
| Test Case | Issue Description | Severity | Notes |
|-----------|------------------|----------|--------|
| TC-XXX.X  | [Description]    | High/Med | [Details] |

### Performance Results
| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| Form Submit | <500ms | XXXms | ✅/❌ |
| Task Toggle | <200ms | XXXms | ✅/❌ |
| Page Load | <2s | XXXs | ✅/❌ |

### Browser Compatibility
- ✅ Chrome XXX
- ✅ Firefox XXX  
- ✅ Safari XXX
- ✅ Edge XXX

### Overall Assessment: PASS/FAIL
```

---

*Test Cases Version: 1.0*  
*Coverage: Core functionality, UI/UX, Performance, Cross-browser*  
*Compliance: README Quality Gates (<1s UI, 100% functionality)*
