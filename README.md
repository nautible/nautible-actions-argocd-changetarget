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

### リビジョンを固定で指定する例

```yaml
uses: actions/nautible-actions-argocd-changetarget@v1.0
with:
  name: 'application.yaml'
  srcRevision: 'develop'
  destRevision: 'HEAD'
```

### マージ時にマージ元・マージ先を自動で設定する例

targetRevisionがマージ元ブランチ名になっているものをすべてマージ先ブランチ名に書き換えるケース。

```yaml
env:
  SRC_BRANCH: ${{ github.head_ref }}
  DEST_BRANCH: ${{ github.base_ref }}
...
steps:
  - name: Change targetRevision
    uses: actions/nautible-actions-argocd-changetarget@v1.0
    with:
      name: 'application.yaml'
      srcRevision: ${{ env.SRC_BRANCH }}
      destRevision: ${{ env.DEST_BRANCH }}
```

### Push先ブランチ名を自動で設定する例

releaseブランチなど、新規作成ブランチをPushした際にブランチ名を書き換えるケース

```yaml
env:
  DEST_BRANCH: ${{ github.ref }}
...
steps:
  - name: Change targetRevision
    uses: actions/nautible-actions-argocd-changetarget@v1.0
    with:
        name: 'application.yaml'
        srcRevision: 'develop'
        destRevision: ${{ env.DEST_BRANCH }}
```

## examples

### application.yaml

targetRevisionの書き換えを確認するためのサンプルファイル。

### pullrequest.yml

プルリクエストをマージした際に実行するGithubActionsのサンプルファイル。  
targetRevisionの書き換えには、書き換え元にマージ前のブランチ、書き換え先にマージ後のブランチが指定されるようにGithubActionsの変数を設定している例。

### releasebranch.yml

リリースブランチを新規作成した際に実行するGithubActionsのサンプルファイル。  
targetRevisionの書き換えには、書き換え元にdevelopを固定で指定し、書き換え先に新規作成ブランチが指定されるようにGithubActionsの変数を設定している例。

## 参考

[GithubActionsの作成手順](https://docs.github.com/ja/actions/creating-actions/creating-a-javascript-action)
