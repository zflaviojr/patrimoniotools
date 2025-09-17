import { query } from './src/config/database.js';

// Atualizar a senha do usuário admin
const updateAdminPassword = async () => {
  try {
    const newPasswordHash = '$2b$10$X8BVmAbj1m.HlYanQPOtYu793w1FPSEOMvOlAPhmaByx9UiVzftVm';
    
    const result = await query(
      "UPDATE users SET password = $1 WHERE username = 'admin' RETURNING *",
      [newPasswordHash]
    );
    
    if (result.rows.length > 0) {
      console.log('Senha do usuário admin atualizada com sucesso!');
      console.log('Usuário atualizado:', result.rows[0]);
    } else {
      console.log('Usuário admin não encontrado');
    }
  } catch (error) {
    console.error('Erro ao atualizar senha:', error);
  }
};

updateAdminPassword();