import addon_utils
import bpy


ADDON_FILE = r"C:\Users\DC\projects\rastislav web\tools\blender-mcp\addon.py"
MODULE_NAME = "addon"


def main() -> None:
    bpy.ops.preferences.addon_install(filepath=ADDON_FILE, overwrite=True)
    bpy.ops.preferences.addon_enable(module=MODULE_NAME)
    bpy.ops.wm.save_userpref()

    addon_utils.modules_refresh()
    enabled = MODULE_NAME in bpy.context.preferences.addons.keys()
    print(f"Blender MCP add-on installed and enabled: {enabled}")


if __name__ == "__main__":
    main()
