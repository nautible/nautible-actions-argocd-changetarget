# ArgoCD Change TargetRevesion javascript action

ArgoCDのApplicationリソースに含まれるtargetRevisionを書き換えます。

リポジトリに含まれるApplicationリソース（ファイル名は指定可能）をすべて検索し、変更元リビジョンが一致するものはすべて書き換えます。

## Inputs

## `name`

**Required** ファイル名（デフォルトは `"application.yaml"`）

## `srcRevision`

**Required** 変更元リビジョン（デフォルトは `"develop"`）

## `destRevision`

**Required** 変更先リビジョン（デフォルトは `"HEAD"`）

## Outputs

## `time`

処理完了時間

## 使用例

```yaml
uses: actions/nautible-actions-argocd-changetarget@v1.0
with:
  name: 'application.yaml'
  srcRevision: 'develop'
  destRevision: 'HEAD'
```
