"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsentTemplateHelper = void 0;
class ConsentTemplateHelper {
    static generateHtmlTemplate(formType, studentName, schoolName, date, studentId) {
        return `
        <div class="consent-form">
          <h2>${formType} Consent Form</h2>
          <div class="form-header">
            <p><strong>Student:</strong> ${studentName}</p>
            <p><strong>School:</strong> ${schoolName}</p>
            <p><strong>Date:</strong> ${date}</p>
            <p><strong>Student ID:</strong> ${studentId}</p>
          </div>
          <div class="form-content">
            <p>This consent form is generated for ${formType} purposes.</p>
            <p>Please review and sign below to indicate your consent.</p>
          </div>
          <div class="signature-section">
            <p>Signature: ___________________________ Date: ___________</p>
          </div>
        </div>
      `;
    }
    static getDefaultVariables(formType, studentId) {
        return {
            studentName: 'Student Name',
            schoolName: 'School Name',
            formType,
            date: new Date().toLocaleDateString(),
            studentId,
        };
    }
}
exports.ConsentTemplateHelper = ConsentTemplateHelper;
//# sourceMappingURL=consent-template.helper.js.map