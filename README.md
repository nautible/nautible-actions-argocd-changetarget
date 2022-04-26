# ArgoCD Change TargetRevesion javascript action

ArgoCDのApplicationリソースに含まれるtargetRevisionを書き換えます。

別ブランチへマージする際に自動でターゲットを切り替える利用を想定しています。

## Inputs

## `name`

**Required** ファイル名 デフォルトは `"application.yaml"`

## `srcRevision`

**Required** 変更元リビジョン デフォルトは `"develop"`

## `name`

**Required** 変更先リビジョン デフォルトは `"HEAD"`

## Outputs

## `time`

処理完了時間

## 使用例

uses: actions/nautible-actions-argocd-changetarget@v1.0
with:
  name: 'application.yaml'
  srcRevision: 'develop'
  destRevision: 'HEAD'
