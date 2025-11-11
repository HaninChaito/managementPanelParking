// controllers/managerController.js
import pool from '../database.js';

export default async function addManager(req, res) {
  const { email } = req.body;

  try {
    // 1. Find the target user
    const [userRows] = await pool.execute(
      'SELECT UserID, Role, FacultyID FROM user WHERE Email = ?',
      [email]
    );

    if (userRows.length === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const targetUser = userRows[0];

    // 2. Check if target user is eligible (Employee or Professor)
    if (!['Employee', 'Professor'].includes(targetUser.Role)) {
      return res.status(400).json({ message: 'يجب أن يكون المدقّق موظّف أو أستاذ' });
    }

    // 3. Verify faculty match (requesting manager vs target user)
    if (targetUser.FacultyID !== req.manager.FacultyID) {
      return res.status(403).json({ 
        message: 'You can only add managers from your own faculty.' 
      });
    }

    // 4. Check if user is already a manager
    const [managerRows] = await pool.execute(
      'SELECT ManagerID FROM manager WHERE UserID = ?',
      [targetUser.UserID]
    );

    if (managerRows.length > 0) {
      return res.status(400).json({ message: 'المستخدم هو مدقّق بالفعل.' });
    }

    // 5. Add as manager (using the user's FacultyID)
    await pool.execute(
      'INSERT INTO manager (UserID, FacultyID) VALUES (?, ?)',
      [targetUser.UserID, targetUser.FacultyID]
    );

    res.status(201).json({ message: 'تم إضافة المدقق بنجاح' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error.' });
  }
}