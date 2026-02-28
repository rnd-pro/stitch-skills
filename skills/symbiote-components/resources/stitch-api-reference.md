# Stitch MCP API Quick Reference

## Available Tools

### Project Management
| Tool | Description |
|------|-------------|
| `list_projects` | List all user projects. Filter: `view=owned` or `view=shared` |
| `get_project` | Get project details. Format: `projects/{projectId}` |
| `create_project` | Create a new Stitch project |

### Screen Management
| Tool | Description |
|------|-------------|
| `list_screens` | List all screens in a project. Requires `projectId` |
| `get_screen` | Get screen details including HTML and screenshot URLs |
| `generate_screen_from_text` | Generate a new screen from a text prompt |
| `edit_screens` | Edit existing screens with a text prompt |
| `generate_variants` | Generate design variants of existing screens |

## Key Response Fields

### Screen Object
```
name: "projects/{projectId}/screens/{screenId}"
title: "Screen Title"
screenshot.downloadUrl: "https://..." (PNG screenshot)
htmlCode.downloadUrl: "https://..." (Full HTML source)
width: 1440
height: 900
deviceType: "DESKTOP" | "MOBILE" | "TABLET"
```

### Project Object
```
name: "projects/{projectId}"
title: "Project Title"
designTheme: { colorMode, fonts, roundness, customColors }
```

## Usage Pattern

```
1. list_projects → find project ID
2. list_screens(projectId) → find screen IDs
3. get_screen(projectId, screenId) → get HTML and screenshot URLs
4. Download HTML → parse → convert to Symbiote components
```
