# Endpoints

| Método HTTP | Endpoint               | Descrição                                         |
| ----------- | ---------------------- | ------------------------------------------------- |
| POST        | /auth/register         | Registra o usuário.                               |
| POST        | /auth/signin           | Autentica o usuário.                              |
| GET         | /auth/me               | Retorna dados do usuário autenticado.             |
| POST        | /categories            | Cria uma nova categoria.                          |
| GET         | /categories            | Faz paginação nas categorias.                     |
| GET         | /categories/{id}       | Obtém uma categoria específica por id.            |
| GET         | /categories/{id}/posts | Obtém todos os posts de uma categoria específica. |
| POST        | /posts                 | Cria um novo post.                                |
| GET         | /posts                 | Faz paginação nos posts.                          |
| GET         | /posts/{id}            | Obtém um post específico por id.                  |

## POST /auth/register

Registra o usuário.

**REQUEST**

```json
{
  "username": "randomusername",
  "password": "randompassword"
}
```

**RESPONSES**

- 201 (Created): Usuário registrado com sucesso.

  ```json
  {
    "message": "User registered successfully."
  }
  ```

- 409 (Conflict): Usuário já existe.

  ```json
  {
    "message": "User already exists."
  }
  ```

## POST /auth/signin

Autentica o usuário.

**REQUEST**

```json
{
  "username": "randomusername",
  "password": "randompassword"
}
```

**RESPONSES**

- 200 (OK): Usuário autenticado com sucesso.

  ```json
  {
    "accessToken": "jwt"
  }
  ```

- 400 (Bad Request): Nome de usuário ou senha incorretos.

  ```json
  {
    "message": "Wrong username or password."
  }
  ```

## GET /auth/me

Retorna dados do usuário autenticado.

**REQUEST**

- Headers
  - Authorization: Bearer `accesstoken`

**RESPONSES**

- 200 (OK): Informações do usuário.

  ```json
  {
    "id": "randomuserid",
    "username": "randomusername"
  }
  ```

- 401 (Unauthorized): Token ausente.

  ```json
  {
    "message": "Token not found."
  }
  ```

- 401 (Unauthorized): Token inválido.

  ```json
  {
    "message": "Invalid token."
  }
  ```

- 404 (Not Found): Usuário não encontrado.

  ```json
  {
    "message": "User not found."
  }
  ```

## POST /categories

Cria uma nova categoria. **Necessita de autenticação**.

**REQUEST**

- Headers
  - Authorization: Bearer `accessToken`
- Body

  ```json
  {
    "name": "randomcategoryname"
  }
  ```

**RESPONSES**

- 201 (Created): Categoria criada com sucesso.

  - Headers
    - Content-Location: /categories/randomcategoryid
  - Body

    ```json
    {
      "id": "randomcategoryid",
      "name": "randomcategoryname"
    }
    ```

- 401 (Unauthorized): Não autenticado.

- 409 (Conflict): Categoria já existe.

  ```json
  {
    "message": "Category already exists."
  }
  ```

## GET /categories

Faz paginação nas categorias.

**REQUEST**

- Query Parameters
  - `?page=1`: Número da página (Padrão: 1).
  - `?pageSize=10`: Quantidade máxima de itens na página (Padrão: 10).

**RESPONSE**

- 200 (OK): Resultados da paginação

  ```json
  {
    "results": [
      {
        "id": "randomcategoryid",
        "name": "randomcategoryname"
      }
    ],
    "length": 1,
    "page": 1,
    "pageSize": 10,
    "total": 1
  }
  ```

- 204 (No Content): Nenhum item encontrado usando as queries especificadas.

## GET /categories/{id}

**REQUEST**

- Path Parameters
  - `id`: id da categoria
- Query Parameters
  - `includePosts=false`: Se true retorna os posts que pertecem à categoria especificada.

**RESPONSE**

- 200 (OK): Informações da Categoria especificada.

  Se o parametro `includePosts` for `false` o campo posts não existirá na resposta.

  ```json
  {
    "id": "randomcategoryid",
    "name": "randomcategoryname",
    "posts": [
      {
        "id": "randompostid",
        "content": "randompostcontent",
        "authorId": "randomuserid",
        "categories": [
          {
            "id": "randomcategoryid",
            "name": "randomcategoryname"
          }
        ]
      }
    ]
  }
  ```

- 404 (No Content): Categoria não encontrada.

  ```json
  {
    "message": "Category not found."
  }
  ```

## GET /categories/{id}/posts

Obtém todos os posts de uma categoria específica.

**REQUEST**

- Path Parameters
  - `id`: id da categoria
- Query Parameters
  - `?page=1`: Número da página (Padrão: 1).
  - `?pageSize=10`: Quantidade máxima de itens na página (Padrão: 10).

**RESPONSE**

- 200 (OK): Todos os posts da categoria especificada.

  ```json
  {
    "results": [
      {
        "id": "randompostid",
        "content": "randompostcontent",
        "authorId": "randomuserid",
        "categories": [
          {
            "id": "randomcategoryid",
            "name": "randomcategoryname"
          }
        ]
      }
    ],
    "length": 1,
    "page": 1,
    "pageSize": 10,
    "total": 1
  }
  ```

- 204 (No Content): Nenhum item encontrado usando as queries especificadas.

- 404 (No Content): Categoria não encontrada.

  ```json
  {
    "message": "Category not found."
  }
  ```

## POST /posts

Cria um novo post. **Necessita de autenticação.**

**REQUEST**

- Headers
  - Authorization: Bearer `accessToken`
- Body

  ```json
  {
    "content": "randompostcontent",
    "categoryIds": ["randomcategoryid"]
  }
  ```

**RESPONSE**

- 201 (Created): Post criado com sucesso.

  - Headers
    - Content-Location: /posts/randompostid
  - Body

    ```json
    {
      "id": "randompostid",
      "content": "randompostcontent",
      "authorId": "randomuserid",
      "categories": [
        {
          "id": "randomcategoryid",
          "name": "randomcategoryname"
        }
      ]
    }
    ```

- 401 (Unauthorized): Não autenticado.

- 404 (Not Found): Uma das categorias especificadas não foi encontrada.

  ```json
  {
    "message": "One or more categories do not exist."
  }
  ```

## GET /posts

Faz paginação nos posts.
