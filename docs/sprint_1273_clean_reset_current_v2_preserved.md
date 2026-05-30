Sprint S1273 preserved current wrapped v2 plan-file compatibility.

Reason:
- The app still saves editable v2 plan files in this slice.
- Users should not save a file that the same build cannot reopen.
- The clean reset save contract needs a separate approved slice.

Raw unwrapped imports now block, but wrapped v2 files remain accepted.
