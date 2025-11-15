const express = require("express");
const authenticateUser = require("../middlewares/authMiddleware.js");
const checkRole = require("../middlewares/roleMiddleware");
const UserModel = require("../Models/Users");

const router = express.Router();

// Apply middleware to each route individually
router.get("/dashboard-stats", authenticateUser, checkRole(['admin']), async (req, res) => {
    try {
        // Get total teachers (approved)
        const totalTeachers = await UserModel.countDocuments({ 
            role: 'teacher', 
            isApproved: true 
        });

        // Get pending teacher requests
        const pendingRequests = await UserModel.countDocuments({ 
            role: 'teacher', 
            isApproved: false 
        });

        // Get total students
        const totalStudents = await UserModel.countDocuments({ 
            role: 'student' 
        });

        

        const activeTopics = 0;

        res.json({
            success: true,
            stats: {
                totalTeachers,
                pendingRequests,
                activeTopics,
                totalStudents
            }
        });
    } catch (error) {
        console.error("Admin dashboard stats error:", error);
        res.status(500).json({ 
            success: false, 
            message: "Failed to fetch dashboard statistics" 
        });
    }
});



// Get all teachers (approved)
router.get("/teachers", authenticateUser, checkRole(['admin']), async (req, res) => {
    try {
        const teachers = await UserModel.find({ 
            role: 'teacher',
            isApproved: true 
        }).select('name email createdAt').sort({ createdAt: -1 });

        res.json({
            success: true,
            teachers: teachers
        });
    } catch (error) {
        console.error("Get teachers error:", error);
        res.status(500).json({ 
            success: false, 
            message: "Failed to fetch teachers" 
        });
    }
});

// Get pending teacher requests
router.get("/teachers/pending", authenticateUser, checkRole(['admin']), async (req, res) => {
    try {
        const pendingTeachers = await UserModel.find({ 
            role: 'teacher',
            isApproved: false 
        }).select('name email createdAt').sort({ createdAt: -1 });

        res.json({
            success: true,
            pendingTeachers: pendingTeachers
        });
    } catch (error) {
        console.error("Get pending teachers error:", error);
        res.status(500).json({ 
            success: false, 
            message: "Failed to fetch pending teachers" 
        });
    }
});

// Approve teacher
router.put("/teachers/:id/approve", authenticateUser, checkRole(['admin']), async (req, res) => {
    try {
        const teacherId = req.params.id;
        
        const updatedTeacher = await UserModel.findByIdAndUpdate(
            teacherId,
            { isApproved: true },
            { new: true }
        ).select('name email role isApproved');

        if (!updatedTeacher) {
            return res.status(404).json({
                success: false,
                message: "Teacher not found"
            });
        }

        res.json({
            success: true,
            message: "Teacher approved successfully",
            teacher: updatedTeacher
        });
    } catch (error) {
        console.error("Approve teacher error:", error);
        res.status(500).json({ 
            success: false, 
            message: "Failed to approve teacher" 
        });
    }
});

// Reject teacher (delete from database)
router.delete("/teachers/:id/reject", authenticateUser, checkRole(['admin']), async (req, res) => {
    try {
        const teacherId = req.params.id;
        
        const deletedTeacher = await UserModel.findByIdAndDelete(teacherId);

        if (!deletedTeacher) {
            return res.status(404).json({
                success: false,
                message: "Teacher not found"
            });
        }

        res.json({
            success: true,
            message: "Teacher rejected and removed successfully"
        });
    } catch (error) {
        console.error("Reject teacher error:", error);
        res.status(500).json({ 
            success: false, 
            message: "Failed to reject teacher" 
        });
    }
});

// Revoke teacher access (set isApproved to false)
router.put("/teachers/:id/revoke", authenticateUser, checkRole(['admin']), async (req, res) => {
    try {
        const teacherId = req.params.id;
        
        const updatedTeacher = await UserModel.findByIdAndUpdate(
            teacherId,
            { isApproved: false },
            { new: true }
        ).select('name email role isApproved');

        if (!updatedTeacher) {
            return res.status(404).json({
                success: false,
                message: "Teacher not found"
            });
        }

        res.json({
            success: true,
            message: "Teacher access revoked successfully",
            teacher: updatedTeacher
        });
    } catch (error) {
        console.error("Revoke teacher error:", error);
        res.status(500).json({ 
            success: false, 
            message: "Failed to revoke teacher access" 
        });
    }
});

module.exports = router;