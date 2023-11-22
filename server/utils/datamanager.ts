import {
  Faculty,
  FacultyInfo,
  Meeting,
  PartialStudent,
  Student,
} from "../../types/types";

export const DataManager = {
  createPartialFaculty(data: any): FacultyInfo {
    return {
      id: data?.id || -1,
      name: data?.name || "Not Assigned",
      department: data?.department || "Not Assigned",
    };
  },
  createFaculty(data: any): Faculty {
    return {
      id: data.id,
      name: data.name,
      department: data.department,
      mentees: data.mentees.map((x: any) => this.createPartialStudent(x)),
    };
  },
  createPartialStudent(data: any): PartialStudent {
    return {
      name: data.name,
      register_number: data.register_no,
      year: data.year,
      section: data.section,
      batch: data.batch,
      department: data.department,
      mentor_id: data.mentor_id,
      mentor: data.mentor
        ? this.createPartialFaculty(data.mentor)
        : data.mentor,
    };
  },
  createStudent(data: any): Student {
    return {
      name: data.name,
      register_number: data.register_no,
      year: data.year,
      section: data.section,
      batch: data.batch,
      department: data.department,
      mentor: this.createPartialFaculty(data.mentor),
      meetings: data.meetings?.map((x: any) =>
        this.createPartialMeeting({ ...x })
      ) || [],
      enable_edit_profile: data.editable_personal,
      personal_info: {
        blood_group: data.blood_group,
        mobile_number: data.mobile_number,
        whatsapp_number: data.whatsapp_number,
        date_of_birth: new Date(data.date_of_birth),
        gender: data.gender,
        email_id: data.email_id,
        father: {
          name: data.f_name,
          occupation: data.f_occupation,
          mobile_number: data.f_mobile_number,
          whatsapp_number: data.f_whatsapp_number,
          email_id: data.f_email_id,
          address: data.f_address,
        },
        mother: {
          name: data.m_name,
          occupation: data.m_occupation,
          mobile_number: data.m_mobile_number,
          whatsapp_number: data.m_whatsapp_number,
          email_id: data.m_email_id,
          address: data.m_address,
        },
      },
      past: {
        sslc: {
          institution: data.sslc_institution,
          board_of_study: data.sslc_board,
          year_of_study: data.sslc_years,
          percentage: data.sslc_percentage,
        },
        hsc: {
          institution: data.hsc_institution,
          board_of_study: data.hsc_board,
          year_of_study: data.hsc_years,
          percentage: data.hsc_percentage,
        },
        jee: {
          rank: data.jee_rank,
          score: data.jee_score,
        },
      },
      achievements: {
        positions_of_responsibility: data.positions_of_responsibility,
        scholarships: data.scholarships,
        competitions: data.competitions,
        special_talents: data.special_talents,
        role_model: data.role_model,
        objectives: data.objectives,
        extra_curricular: data.extra_curricular,
      },
      reassessment_info: data.reassessment_info,
      placement_studies: data.placement_studies,
      student_comments: data.student_comments,
      academics: data.academics?.map((x: any) => ({
        special: x.special,
        clubs: x.clubs,
        academic: x.academic,
        disciplinary_actions: x.disciplinary_actions,
        odd_sem: {
          semester: x.os_sem,
          academic_year: x.os_year,
          hostel: x.os_hostel,
          subjects: [
            { name: x.os_subject_1_name, grade: x.os_subject_1_grade },
            { name: x.os_subject_2_name, grade: x.os_subject_2_grade },
            { name: x.os_subject_3_name, grade: x.os_subject_3_grade },
            { name: x.os_subject_4_name, grade: x.os_subject_4_grade },
            { name: x.os_subject_5_name, grade: x.os_subject_5_grade },
            { name: x.os_subject_6_name, grade: x.os_subject_6_grade },
            { name: x.os_subject_7_name, grade: x.os_subject_7_grade },
            { name: x.os_subject_8_name, grade: x.os_subject_8_grade },
            { name: x.os_subject_9_name, grade: x.os_subject_9_grade },
          ],
        },
        even_sem: {
          semester: x.es_sem,
          academic_year: x.es_year,
          hostel: x.es_hostel,
          subjects: [
            { name: x.es_subject_1_name, grade: x.es_subject_1_grade },
            { name: x.es_subject_2_name, grade: x.es_subject_2_grade },
            { name: x.es_subject_3_name, grade: x.es_subject_3_grade },
            { name: x.es_subject_4_name, grade: x.es_subject_4_grade },
            { name: x.es_subject_5_name, grade: x.es_subject_5_grade },
            { name: x.es_subject_6_name, grade: x.es_subject_6_grade },
            { name: x.es_subject_7_name, grade: x.es_subject_7_grade },
            { name: x.es_subject_8_name, grade: x.es_subject_8_grade },
            { name: x.es_subject_9_name, grade: x.es_subject_9_grade },
          ],
        },
      })) || [],
    };
  },
  createPartialMeeting(
    data: any,
  ): { discussion: string; id: number; date: Date } {
    return {
      id: data.id,
      date: new Date(data.date),
      discussion: data.discussion,
    };
  },
  createMeeting(data: any): Meeting {
    return {
      id: data.id,
      date: new Date(data.date),
      discussion: data.discussion,
      mentee: this.createPartialStudent(data.mentee),
      mentor: this.createPartialFaculty(data.mentor),
    };
  },
};
