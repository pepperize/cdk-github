# API Reference <a name="API Reference" id="api-reference"></a>

## Constructs <a name="Constructs" id="Constructs"></a>

### GithubCustomResource <a name="GithubCustomResource" id="@pepperize/cdk-github.GithubCustomResource"></a>

```typescript const auth = secrets_manager.Secret.fromSecretNameV2(scope, "Auth", "cdk-github/github-token");

new GithubCustomResource(scope, "GithubRepo", {
   onCreate: {
     // https://octokit.github.io/rest.js/v19/#repos-create-in-org
     endpoint: "repos",
     method: "createInOrg",
     parameters: {
       org: "pepperize",
       name: "cdk-github",
     },
     outputPaths: ["id", "full_name"],
     physicalResourceId: custom_resources.PhysicalResourceId.fromResponse("full_name"),
     ignoreErrorCodesMatching: "name already exists on this account",
   },
   onUpdate: {
     // https://octokit.github.io/rest.js/v19#repos-get
     endpoint: "repos",
     method: "get",
     parameters: {
       owner: "pepperize",
       repo: "cdk-github",
     },
     outputPaths: ["id", "full_name"],
     physicalResourceId: custom_resources.PhysicalResourceId.fromResponse("full_name"),
   },
   onDelete: {
     // https://octokit.github.io/rest.js/v19#repos-delete
     endpoint: "repos",
     method: "delete",
     parameters: {
       owner: "pepperize",
       repo: "cdk-github",
     },
     outputPaths: [],
   },
   authOptions: AuthOptions.appAuth(auth),
});
```

#### Initializers <a name="Initializers" id="@pepperize/cdk-github.GithubCustomResource.Initializer"></a>

```typescript
import { GithubCustomResource } from '@pepperize/cdk-github'

new GithubCustomResource(scope: Construct, id: string, props: GithubCustomResourceProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@pepperize/cdk-github.GithubCustomResource.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#@pepperize/cdk-github.GithubCustomResource.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@pepperize/cdk-github.GithubCustomResource.Initializer.parameter.props">props</a></code> | <code><a href="#@pepperize/cdk-github.GithubCustomResourceProps">GithubCustomResourceProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@pepperize/cdk-github.GithubCustomResource.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="@pepperize/cdk-github.GithubCustomResource.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="@pepperize/cdk-github.GithubCustomResource.Initializer.parameter.props"></a>

- *Type:* <a href="#@pepperize/cdk-github.GithubCustomResourceProps">GithubCustomResourceProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@pepperize/cdk-github.GithubCustomResource.toString">toString</a></code> | Returns a string representation of this construct. |
| <code><a href="#@pepperize/cdk-github.GithubCustomResource.getAtt">getAtt</a></code> | Returns the value of an attribute of the custom resource of an arbitrary type. |
| <code><a href="#@pepperize/cdk-github.GithubCustomResource.getAttString">getAttString</a></code> | Returns the value of an attribute of the custom resource of type string. |

---

##### `toString` <a name="toString" id="@pepperize/cdk-github.GithubCustomResource.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

##### `getAtt` <a name="getAtt" id="@pepperize/cdk-github.GithubCustomResource.getAtt"></a>

```typescript
public getAtt(attributeName: string): Reference
```

Returns the value of an attribute of the custom resource of an arbitrary type.

Attributes are returned from the custom resource provider through the
`Data` map where the key is the attribute name.

###### `attributeName`<sup>Required</sup> <a name="attributeName" id="@pepperize/cdk-github.GithubCustomResource.getAtt.parameter.attributeName"></a>

- *Type:* string

the name of the attribute.

---

##### `getAttString` <a name="getAttString" id="@pepperize/cdk-github.GithubCustomResource.getAttString"></a>

```typescript
public getAttString(attributeName: string): string
```

Returns the value of an attribute of the custom resource of type string.

Attributes are returned from the custom resource provider through the
`Data` map where the key is the attribute name.

###### `attributeName`<sup>Required</sup> <a name="attributeName" id="@pepperize/cdk-github.GithubCustomResource.getAttString.parameter.attributeName"></a>

- *Type:* string

the name of the attribute.

---

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@pepperize/cdk-github.GithubCustomResource.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="@pepperize/cdk-github.GithubCustomResource.isConstruct"></a>

```typescript
import { GithubCustomResource } from '@pepperize/cdk-github'

GithubCustomResource.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="@pepperize/cdk-github.GithubCustomResource.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@pepperize/cdk-github.GithubCustomResource.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#@pepperize/cdk-github.GithubCustomResource.property.ref">ref</a></code> | <code>string</code> | The physical name of this custom resource. |

---

##### `node`<sup>Required</sup> <a name="node" id="@pepperize/cdk-github.GithubCustomResource.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `ref`<sup>Required</sup> <a name="ref" id="@pepperize/cdk-github.GithubCustomResource.property.ref"></a>

```typescript
public readonly ref: string;
```

- *Type:* string

The physical name of this custom resource.

---


### GithubCustomResourceBase <a name="GithubCustomResourceBase" id="@pepperize/cdk-github.GithubCustomResourceBase"></a>

#### Initializers <a name="Initializers" id="@pepperize/cdk-github.GithubCustomResourceBase.Initializer"></a>

```typescript
import { GithubCustomResourceBase } from '@pepperize/cdk-github'

new GithubCustomResourceBase(scope: Construct, id: string)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@pepperize/cdk-github.GithubCustomResourceBase.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | The scope in which to define this construct. |
| <code><a href="#@pepperize/cdk-github.GithubCustomResourceBase.Initializer.parameter.id">id</a></code> | <code>string</code> | The scoped construct ID. |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@pepperize/cdk-github.GithubCustomResourceBase.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

The scope in which to define this construct.

---

##### `id`<sup>Required</sup> <a name="id" id="@pepperize/cdk-github.GithubCustomResourceBase.Initializer.parameter.id"></a>

- *Type:* string

The scoped construct ID.

Must be unique amongst siblings. If
the ID includes a path separator (`/`), then it will be replaced by double
dash `--`.

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@pepperize/cdk-github.GithubCustomResourceBase.toString">toString</a></code> | Returns a string representation of this construct. |
| <code><a href="#@pepperize/cdk-github.GithubCustomResourceBase.getAtt">getAtt</a></code> | Returns the value of an attribute of the custom resource of an arbitrary type. |
| <code><a href="#@pepperize/cdk-github.GithubCustomResourceBase.getAttString">getAttString</a></code> | Returns the value of an attribute of the custom resource of type string. |

---

##### `toString` <a name="toString" id="@pepperize/cdk-github.GithubCustomResourceBase.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

##### `getAtt` <a name="getAtt" id="@pepperize/cdk-github.GithubCustomResourceBase.getAtt"></a>

```typescript
public getAtt(attributeName: string): Reference
```

Returns the value of an attribute of the custom resource of an arbitrary type.

Attributes are returned from the custom resource provider through the
`Data` map where the key is the attribute name.

###### `attributeName`<sup>Required</sup> <a name="attributeName" id="@pepperize/cdk-github.GithubCustomResourceBase.getAtt.parameter.attributeName"></a>

- *Type:* string

the name of the attribute.

---

##### `getAttString` <a name="getAttString" id="@pepperize/cdk-github.GithubCustomResourceBase.getAttString"></a>

```typescript
public getAttString(attributeName: string): string
```

Returns the value of an attribute of the custom resource of type string.

Attributes are returned from the custom resource provider through the
`Data` map where the key is the attribute name.

###### `attributeName`<sup>Required</sup> <a name="attributeName" id="@pepperize/cdk-github.GithubCustomResourceBase.getAttString.parameter.attributeName"></a>

- *Type:* string

the name of the attribute.

---

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@pepperize/cdk-github.GithubCustomResourceBase.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="@pepperize/cdk-github.GithubCustomResourceBase.isConstruct"></a>

```typescript
import { GithubCustomResourceBase } from '@pepperize/cdk-github'

GithubCustomResourceBase.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="@pepperize/cdk-github.GithubCustomResourceBase.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@pepperize/cdk-github.GithubCustomResourceBase.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#@pepperize/cdk-github.GithubCustomResourceBase.property.ref">ref</a></code> | <code>string</code> | The physical name of this custom resource. |

---

##### `node`<sup>Required</sup> <a name="node" id="@pepperize/cdk-github.GithubCustomResourceBase.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `ref`<sup>Required</sup> <a name="ref" id="@pepperize/cdk-github.GithubCustomResourceBase.property.ref"></a>

```typescript
public readonly ref: string;
```

- *Type:* string

The physical name of this custom resource.

---


## Structs <a name="Structs" id="Structs"></a>

### GithubApiCall <a name="GithubApiCall" id="@pepperize/cdk-github.GithubApiCall"></a>

#### Initializer <a name="Initializer" id="@pepperize/cdk-github.GithubApiCall.Initializer"></a>

```typescript
import { GithubApiCall } from '@pepperize/cdk-github'

const githubApiCall: GithubApiCall = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@pepperize/cdk-github.GithubApiCall.property.endpoint">endpoint</a></code> | <code>string</code> | The endpoint to call. |
| <code><a href="#@pepperize/cdk-github.GithubApiCall.property.method">method</a></code> | <code>string</code> | The method to call. |
| <code><a href="#@pepperize/cdk-github.GithubApiCall.property.ignoreErrorCodesMatching">ignoreErrorCodesMatching</a></code> | <code>string</code> | The regex pattern to use to catch API errors. |
| <code><a href="#@pepperize/cdk-github.GithubApiCall.property.outputPaths">outputPaths</a></code> | <code>string[]</code> | Filter the data returned by the custom resource to specific paths in the API response. |
| <code><a href="#@pepperize/cdk-github.GithubApiCall.property.parameters">parameters</a></code> | <code>any</code> | The parameters for the service action. |
| <code><a href="#@pepperize/cdk-github.GithubApiCall.property.physicalResourceId">physicalResourceId</a></code> | <code>aws-cdk-lib.custom_resources.PhysicalResourceId</code> | The physical resource id of the custom resource for this call. |

---

##### `endpoint`<sup>Required</sup> <a name="endpoint" id="@pepperize/cdk-github.GithubApiCall.property.endpoint"></a>

```typescript
public readonly endpoint: string;
```

- *Type:* string

The endpoint to call.

> [https://github.com/octokit/rest.js](https://github.com/octokit/rest.js)

---

##### `method`<sup>Required</sup> <a name="method" id="@pepperize/cdk-github.GithubApiCall.property.method"></a>

```typescript
public readonly method: string;
```

- *Type:* string

The method to call.

> [https://github.com/octokit/rest.js](https://github.com/octokit/rest.js)

---

##### `ignoreErrorCodesMatching`<sup>Optional</sup> <a name="ignoreErrorCodesMatching" id="@pepperize/cdk-github.GithubApiCall.property.ignoreErrorCodesMatching"></a>

```typescript
public readonly ignoreErrorCodesMatching: string;
```

- *Type:* string

The regex pattern to use to catch API errors.

The `message` property of the `RequestError` object will be tested against this pattern. If there is a match an error will not be thrown.

---

##### `outputPaths`<sup>Optional</sup> <a name="outputPaths" id="@pepperize/cdk-github.GithubApiCall.property.outputPaths"></a>

```typescript
public readonly outputPaths: string[];
```

- *Type:* string[]
- *Default:* undefined - it's recommended to define it

Filter the data returned by the custom resource to specific paths in the API response.

<b>The total size of the response body can't exceed 4096 bytes.</b>

> [https://docs.github.com/en/rest

Example for octokit.rest.repos.createInOrg: ['id', 'full_name', 'owner.id']](https://docs.github.com/en/rest

Example for octokit.rest.repos.createInOrg: ['id', 'full_name', 'owner.id'])

---

##### `parameters`<sup>Optional</sup> <a name="parameters" id="@pepperize/cdk-github.GithubApiCall.property.parameters"></a>

```typescript
public readonly parameters: any;
```

- *Type:* any

The parameters for the service action.

> [https://github.com/octokit/rest.js](https://github.com/octokit/rest.js)

---

##### `physicalResourceId`<sup>Optional</sup> <a name="physicalResourceId" id="@pepperize/cdk-github.GithubApiCall.property.physicalResourceId"></a>

```typescript
public readonly physicalResourceId: PhysicalResourceId;
```

- *Type:* aws-cdk-lib.custom_resources.PhysicalResourceId
- *Default:* undefined - for "Create" requests, defaults to the event's RequestId, for "Update" and "Delete", defaults to the current `PhysicalResourceId`.

The physical resource id of the custom resource for this call.

> [https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/crpg-ref-responses.html](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/crpg-ref-responses.html)

---

### GithubCustomResourceOptions <a name="GithubCustomResourceOptions" id="@pepperize/cdk-github.GithubCustomResourceOptions"></a>

#### Initializer <a name="Initializer" id="@pepperize/cdk-github.GithubCustomResourceOptions.Initializer"></a>

```typescript
import { GithubCustomResourceOptions } from '@pepperize/cdk-github'

const githubCustomResourceOptions: GithubCustomResourceOptions = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@pepperize/cdk-github.GithubCustomResourceOptions.property.authOptions">authOptions</a></code> | <code><a href="#@pepperize/cdk-github.IAuthOptions">IAuthOptions</a></code> | Currently, supports only GitHub App. |

---

##### `authOptions`<sup>Required</sup> <a name="authOptions" id="@pepperize/cdk-github.GithubCustomResourceOptions.property.authOptions"></a>

```typescript
public readonly authOptions: IAuthOptions;
```

- *Type:* <a href="#@pepperize/cdk-github.IAuthOptions">IAuthOptions</a>

Currently, supports only GitHub App.

```typescript
const auth = { appId, privateKey };
const installationAuth = { appId, privateKey, installationId };
```

> [https://github.com/octokit/authentication-strategies.js/#github-app-or-installation-authentication](https://github.com/octokit/authentication-strategies.js/#github-app-or-installation-authentication)

---

### GithubCustomResourceProps <a name="GithubCustomResourceProps" id="@pepperize/cdk-github.GithubCustomResourceProps"></a>

#### Initializer <a name="Initializer" id="@pepperize/cdk-github.GithubCustomResourceProps.Initializer"></a>

```typescript
import { GithubCustomResourceProps } from '@pepperize/cdk-github'

const githubCustomResourceProps: GithubCustomResourceProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@pepperize/cdk-github.GithubCustomResourceProps.property.authOptions">authOptions</a></code> | <code><a href="#@pepperize/cdk-github.IAuthOptions">IAuthOptions</a></code> | Currently, supports only GitHub App. |
| <code><a href="#@pepperize/cdk-github.GithubCustomResourceProps.property.onCreate">onCreate</a></code> | <code><a href="#@pepperize/cdk-github.GithubApiCall">GithubApiCall</a></code> | The GitHub Api call to make when the resource is created. |
| <code><a href="#@pepperize/cdk-github.GithubCustomResourceProps.property.onDelete">onDelete</a></code> | <code><a href="#@pepperize/cdk-github.GithubApiCall">GithubApiCall</a></code> | The GitHub Api call to make when the resource is deleted. |
| <code><a href="#@pepperize/cdk-github.GithubCustomResourceProps.property.onUpdate">onUpdate</a></code> | <code><a href="#@pepperize/cdk-github.GithubApiCall">GithubApiCall</a></code> | The GitHub Api call to make when the resource is updated. |
| <code><a href="#@pepperize/cdk-github.GithubCustomResourceProps.property.resourceType">resourceType</a></code> | <code>string</code> | Cloudformation Resource type. |

---

##### `authOptions`<sup>Required</sup> <a name="authOptions" id="@pepperize/cdk-github.GithubCustomResourceProps.property.authOptions"></a>

```typescript
public readonly authOptions: IAuthOptions;
```

- *Type:* <a href="#@pepperize/cdk-github.IAuthOptions">IAuthOptions</a>

Currently, supports only GitHub App.

```typescript
const auth = { appId, privateKey };
const installationAuth = { appId, privateKey, installationId };
```

> [https://github.com/octokit/authentication-strategies.js/#github-app-or-installation-authentication](https://github.com/octokit/authentication-strategies.js/#github-app-or-installation-authentication)

---

##### `onCreate`<sup>Optional</sup> <a name="onCreate" id="@pepperize/cdk-github.GithubCustomResourceProps.property.onCreate"></a>

```typescript
public readonly onCreate: GithubApiCall;
```

- *Type:* <a href="#@pepperize/cdk-github.GithubApiCall">GithubApiCall</a>

The GitHub Api call to make when the resource is created.

---

##### `onDelete`<sup>Optional</sup> <a name="onDelete" id="@pepperize/cdk-github.GithubCustomResourceProps.property.onDelete"></a>

```typescript
public readonly onDelete: GithubApiCall;
```

- *Type:* <a href="#@pepperize/cdk-github.GithubApiCall">GithubApiCall</a>

The GitHub Api call to make when the resource is deleted.

---

##### `onUpdate`<sup>Optional</sup> <a name="onUpdate" id="@pepperize/cdk-github.GithubCustomResourceProps.property.onUpdate"></a>

```typescript
public readonly onUpdate: GithubApiCall;
```

- *Type:* <a href="#@pepperize/cdk-github.GithubApiCall">GithubApiCall</a>

The GitHub Api call to make when the resource is updated.

---

##### `resourceType`<sup>Optional</sup> <a name="resourceType" id="@pepperize/cdk-github.GithubCustomResourceProps.property.resourceType"></a>

```typescript
public readonly resourceType: string;
```

- *Type:* string

Cloudformation Resource type.

---

## Classes <a name="Classes" id="Classes"></a>

### AuthOptions <a name="AuthOptions" id="@pepperize/cdk-github.AuthOptions"></a>

- *Implements:* <a href="#@pepperize/cdk-github.IAuthOptions">IAuthOptions</a>

#### Initializers <a name="Initializers" id="@pepperize/cdk-github.AuthOptions.Initializer"></a>

```typescript
import { AuthOptions } from '@pepperize/cdk-github'

new AuthOptions()
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |

---


#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@pepperize/cdk-github.AuthOptions.appAuth">appAuth</a></code> | GitHub App or installation authentication. |
| <code><a href="#@pepperize/cdk-github.AuthOptions.tokenAuth">tokenAuth</a></code> | Personal Access Token authentication. |
| <code><a href="#@pepperize/cdk-github.AuthOptions.unauthenticated">unauthenticated</a></code> | unauthenticated. |

---

##### `appAuth` <a name="appAuth" id="@pepperize/cdk-github.AuthOptions.appAuth"></a>

```typescript
import { AuthOptions } from '@pepperize/cdk-github'

AuthOptions.appAuth(secret: ISecret)
```

GitHub App or installation authentication.

> [https://github.com/octokit/auth-app.js/#readme](https://github.com/octokit/auth-app.js/#readme)

###### `secret`<sup>Required</sup> <a name="secret" id="@pepperize/cdk-github.AuthOptions.appAuth.parameter.secret"></a>

- *Type:* aws-cdk-lib.aws_secretsmanager.ISecret

---

##### `tokenAuth` <a name="tokenAuth" id="@pepperize/cdk-github.AuthOptions.tokenAuth"></a>

```typescript
import { AuthOptions } from '@pepperize/cdk-github'

AuthOptions.tokenAuth(parameter: IParameter)
```

Personal Access Token authentication.

> [https://github.com/octokit/auth-token.js#readme](https://github.com/octokit/auth-token.js#readme)

###### `parameter`<sup>Required</sup> <a name="parameter" id="@pepperize/cdk-github.AuthOptions.tokenAuth.parameter.parameter"></a>

- *Type:* aws-cdk-lib.aws_ssm.IParameter

---

##### `unauthenticated` <a name="unauthenticated" id="@pepperize/cdk-github.AuthOptions.unauthenticated"></a>

```typescript
import { AuthOptions } from '@pepperize/cdk-github'

AuthOptions.unauthenticated()
```

unauthenticated.

> [https://github.com/octokit/auth-unauthenticated.js#readme](https://github.com/octokit/auth-unauthenticated.js#readme)



## Protocols <a name="Protocols" id="Protocols"></a>

### IAuthOptions <a name="IAuthOptions" id="@pepperize/cdk-github.IAuthOptions"></a>

- *Implemented By:* <a href="#@pepperize/cdk-github.AuthOptions">AuthOptions</a>, <a href="#@pepperize/cdk-github.IAuthOptions">IAuthOptions</a>



