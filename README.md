# GitHub Action for fetching repository configurations (.github content)

## Example usage

```yaml
jobs:
  configuration-sync:
    runs-on: ubuntu-latest
    permissions:
      contents: write
    steps:
      - name: Github Configuration Sync
        uses: finanzero/fnz-github-sync@1.0.0
```
