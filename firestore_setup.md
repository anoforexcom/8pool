# 🔥 Firestore Setup Guide: sudokas.live

To ensure your database works correctly and securely with the new code, please follow these steps in your Firebase Console.

## 1. Security Rules
Go to **Firestore Database > Rules**. 

> [!IMPORTANT]
> **NÃO copies** os acentos graves (\`\`\`) nem a palavra "javascript". Copia apenas o código abaixo:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Profiles: Users can read all (for leaderboard) but only write their own
    match /profiles/{userId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Purchases: Users can only see and create their own records
    match /purchases/{purchaseId} {
      allow create: if request.auth != null && request.resource.data.user_id == request.auth.uid;
      allow read: if request.auth != null && resource.data.user_id == request.auth.uid;
    }
    
    // Chat: Anyone can read messages, authenticated users can send
    match /chat_messages/{messageId} {
      allow read: if true;
      allow create: if request.auth != null;
    }

    // Config: Publicly readable, but only admins can write
    match /config/{document} {
      allow read: if true;
      allow write: if request.auth != null && get(/databases/$(database)/documents/profiles/$(request.auth.uid)).data.is_admin == true;
    }
  }
}
```

## 2. Como te tornares Administrador (Passo a Passo)

Para teres acesso ao painel de **Pagamentos** e **Configurações**, precisas de dar permissão ao teu utilizador na base de dados:

1.  **Faz Login no site**: Entra no teu site `sudokas.live` com o teu email.
2.  **Firebase Console**: Abre o [Firebase Console](https://console.firebase.google.com/).
3.  **Authentication**: Clica em "Authentication" na coluna esquerda e **copia o teu "User UID"** (um código longo de letras e números).
4.  **Firestore Database**: Vai a "Firestore Database" e abre a coleção **`profiles`**.
5.  **Encontra o teu perfil**: Procura o documento que tem o nome do teu UID.
6.  **Adicionar Campo**:
    *   Clica em **"+ Add field"**.
    *   **Field name**: `is_admin`
    *   **Type**: `boolean`
    *   **Value**: `true` (seleciona a caixa).
7.  **Reinicia o site**: Agora, ao entrares no site, já terás acesso a todas as opções de administrador!

---

**Nota:** As chaves de pagamento ficam guardadas com segurança na coleção `config`, e só tu (como admin) as podes mudar.
