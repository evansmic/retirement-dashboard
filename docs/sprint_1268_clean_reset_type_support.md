Sprint S1268 added clean reset type support.

Added:
- Clean reset schema version constant.
- Clean reset payload type.
- Runtime conversion boundary from clean reset payload into current v2 runtime shape.

The conversion keeps calculated capacity and funding trace out of saved/imported payloads.
