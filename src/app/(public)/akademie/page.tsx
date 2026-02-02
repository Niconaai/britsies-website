// src/app/(public)/akademie/page.tsx
import React from 'react';
import { createClient } from "@/utils/supabase/server";
import AkademieClientPage from "./AkademieClientPage";
import type { StaffMemberWithAcademicInfo, GradeClassWithDetails, DbSubject, DbStaffDepartment } from "@/types/supabase";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Hoërskool Brits | Akademie",
    description: "Verken die akademiese aanbod, vakkeuses en personeel van Hoërskool Brits.",
};

// Enhanced staff type with subjects
type StaffWithSubjects = StaffMemberWithAcademicInfo & {
  subjects_data: DbSubject[] | null;
};

export default async function AkademiePage() {
    const supabase = await createClient();

    // Fetch all active staff with their relationships
    const { data: staffData, error: staffError } = await supabase
        .from('staff_members')
        .select(`
            *,
            staff_departments!inner ( id, name, sort_order ),
            staff_subjects ( subject_id ),
            grade_classes!grade_classes_grade_head_id_fkey ( id, name, grade_level )
        `)
        .eq('is_active', true)
        .order('sort_order');

    // Fetch subjects separately to join
    const { data: subjectsData, error: subjectsError } = await supabase
        .from('subjects')
        .select('*')
        .eq('is_active', true);

    // Fetch grade classes with their guardians
    const { data: gradeClassesData, error: gradeClassesError } = await supabase
        .from('grade_classes')
        .select(`
            *,
            grade_head:staff_members!grade_classes_grade_head_id_fkey ( id, full_name, title, image_url )
        `)
        .eq('is_active', true)
        .order('sort_order');

    // Fetch class guardians relationships
    const { data: guardiansData, error: guardiansError } = await supabase
        .from('class_guardians')
        .select(`
            staff_member_id,
            grade_class_id
        `);

    if (staffError || subjectsError || gradeClassesError || guardiansError) {
        console.error("Error loading Akademie data:", { staffError, subjectsError, gradeClassesError, guardiansError });
    }

    const allStaff = (staffData || []) as any[];
    const allSubjects = (subjectsData || []) as DbSubject[];
    const gradeClasses = (gradeClassesData || []) as any[];
    const guardianRelations = (guardiansData || []) as any[];

    // Create a map of subject_id to subject data
    const subjectMap = new Map(allSubjects.map(s => [s.id, s]));

    // Enhance staff with their subjects
    const staffWithSubjects: StaffWithSubjects[] = allStaff.map(staff => {
        const subjectIds = (staff.staff_subjects || []).map((ss: any) => ss.subject_id);
        const subjects_data = subjectIds.map((id: string) => subjectMap.get(id)).filter(Boolean) as DbSubject[];
        
        return {
            ...staff,
            subjects_data,
            grade_head_for: staff.grade_classes || null,
        };
    });

    // Create a map of staff_id to staff data
    const staffMap = new Map(staffWithSubjects.map(s => [s.id, s]));

    // Build the grade class structure with guardians
    const gradeClassesWithGuardians = gradeClasses.map(gc => {
        const guardianIds = guardianRelations
            .filter((gr: any) => gr.grade_class_id === gc.id)
            .map((gr: any) => gr.staff_member_id);
        
        const guardians = guardianIds
            .map((id: string) => {
                const staff = staffMap.get(id);
                if (!staff) return null;
                // Add the class name to each guardian
                return {
                    ...staff,
                    guardian_class_name: gc.name,
                };
            })
            .filter(Boolean) as StaffWithSubjects[];

        // Get full grade head data with subjects from staffMap
        const gradeHeadWithSubjects = gc.grade_head_id ? staffMap.get(gc.grade_head_id) : null;

        return {
            ...gc,
            grade_head: gradeHeadWithSubjects, // Replace basic grade_head with full data including subjects
            guardians: guardians.sort((a, b) => (a.sort_order || 99) - (b.sort_order || 99)),
        };
    });

    // Get leadership staff (identified by title containing leadership keywords, excluding Koshuis)
    const leadershipKeywords = ['hoof', 'deputy', 'departementshoof', 'onderhoof'];
    const leadershipStaff = staffWithSubjects.filter(staff => {
        const title = (staff.title || '').toLowerCase();
        const isLeadership = leadershipKeywords.some(keyword => title.includes(keyword));
        const isKoshuis = staff.staff_departments?.some(dept => dept.name === 'Koshuis');
        return isLeadership && !isKoshuis;
    }).sort((a, b) => (a.sort_order || 99) - (b.sort_order || 99));

    // Get teachers without guardian classes (excluding leadership, admin, and koshuis)
    const excludedDepartments = ['Administrasie', 'Studente', 'Beheerliggaam', 'Koshuis'];
    const gradeHeadIds = new Set(gradeClasses.filter(gc => gc.grade_head_id).map(gc => gc.grade_head_id));
    const guardianStaffIds = new Set(guardianRelations.map((gr: any) => gr.staff_member_id));
    
    const teachersWithoutClasses = staffWithSubjects.filter(staff => {
        // Check if staff is leadership by title
        const title = (staff.title || '').toLowerCase();
        const isLeadership = leadershipKeywords.some(keyword => title.includes(keyword));
        
        const isInExcludedDept = staff.staff_departments?.some(dept => excludedDepartments.includes(dept.name));
        const isGradeHead = gradeHeadIds.has(staff.id);
        const isGuardian = guardianStaffIds.has(staff.id);
        
        return !isLeadership && !isInExcludedDept && !isGradeHead && !isGuardian;
    }).sort((a, b) => (a.sort_order || 99) - (b.sort_order || 99));

    // Get admin staff
    const adminStaff = staffWithSubjects.filter(staff =>
        staff.staff_departments?.some(dept => dept.name === 'Administrasie')
    ).sort((a, b) => (a.sort_order || 99) - (b.sort_order || 99));

    // Get student staff
    const studentStaff = staffWithSubjects.filter(staff =>
        staff.staff_departments?.some(dept => dept.name === 'Studente')
    ).sort((a, b) => (a.sort_order || 99) - (b.sort_order || 99));

    return (
        <AkademieClientPage 
            leadershipStaff={leadershipStaff}
            gradeClasses={gradeClassesWithGuardians}
            teachersWithoutClasses={teachersWithoutClasses}
            adminStaff={adminStaff}
            studentStaff={studentStaff}
        />
    );
}
