# Test Checklist

Complete testing checklist for the Physiotherapy Scheduler application v2.0.0

## 📅 Calendar Rules (KSA Workweek)

### ✅ Day Exclusion Tests
- [ ] **Friday exclusion**: Verify Friday (الجمعة) never appears in day/week/month views
- [ ] **Saturday exclusion**: Verify Saturday (السبت) never appears in day/week/month views  
- [ ] **No-clinic days**: Verify days with no scheduled providers are hidden from calendar views
- [ ] **Working day navigation**: Confirm navigation arrows skip non-working days automatically
- [ ] **Week view display**: Ensure only Sunday-Thursday appear when providers work those days
- [ ] **Month view filtering**: Verify only working days are highlighted/clickable in month view

### Test Steps:
1. Open the application and navigate to Week View
2. Confirm only working days (Sun-Thu) are visible
3. Use navigation arrows to move between weeks
4. Verify weekends are never shown
5. Check that days with no provider schedules are excluded

**Expected Result**: Only Sunday through Thursday appear, and only days with scheduled clinics are shown.

---

## 🆓 Free Booking Modal

### ✅ Time Validation Tests
- [ ] **08:00 acceptance**: Verify 08:00 is accepted as valid booking time
- [ ] **15:30 acceptance**: Verify 15:30 is accepted as valid booking time  
- [ ] **07:59 rejection**: Verify times before 08:00 show error message
- [ ] **15:31 rejection**: Verify times after 15:30 show error message
- [ ] **Invalid format rejection**: Verify non-time formats show appropriate error
- [ ] **Empty time validation**: Verify empty time field shows validation message

### ✅ Booking Functionality Tests
- [ ] **Any day booking**: Verify can book appointments on weekends and holidays
- [ ] **Data persistence**: Confirm bookings save using existing appointment system
- [ ] **Audit logging**: Verify booking actions are logged with "Free Booking" label
- [ ] **Form validation**: Test all required fields (file number, provider, date, time)
- [ ] **Success feedback**: Confirm success message appears after valid booking

### Test Steps:
1. Click "Free Booking" button from FAB menu
2. Enter file number: "TEST123"
3. Select a provider from dropdown
4. Choose any date (including weekends)
5. Test time boundaries:
   - Enter 07:59 → should show error
   - Enter 08:00 → should be accepted
   - Enter 15:30 → should be accepted  
   - Enter 15:31 → should show error
6. Submit valid booking and verify success

**Expected Result**: Only times between 08:00-15:30 are accepted. Bookings work on any day and save properly.

---

## 📊 Capacity Stats & Provider Filtering

### ✅ Stats Integration Tests
- [ ] **Provider filter impact**: Verify stats update when filtering by provider
- [ ] **Specialty filter impact**: Verify stats update when filtering by specialty
- [ ] **Date change impact**: Verify stats recalculate when changing selected date
- [ ] **Vacation status reflection**: Confirm providers on vacation show correctly in stats
- [ ] **Availability calculation**: Verify available slots = total capacity - booked appointments
- [ ] **Real-time updates**: Confirm stats update immediately when bookings are made/cancelled

### ✅ Badge & Indicator Tests
- [ ] **Available badge (green)**: Shows when provider has open slots
- [ ] **Full badge (red)**: Shows when provider capacity is reached
- [ ] **Vacation badge (yellow)**: Shows when provider is on vacation
- [ ] **Count accuracy**: Verify badge numbers match actual available/booked slots
- [ ] **Disabled state**: Confirm zero-capacity providers show appropriate disabled state

### Test Steps:
1. Select "All Specialties" and note total stats
2. Filter by "MSK" specialty only and verify stats update
3. Select a specific provider and confirm stats show only that provider
4. Change date and verify stats recalculate
5. Book an appointment and confirm stats update in real-time
6. Check a day when a provider is on vacation

**Expected Result**: All stats accurately reflect current filters and update dynamically.

---

## 🖨️ Print Functionality (A4 One-pager)

### ✅ Print Layout Tests
- [ ] **A4 page size**: Verify printed output fits properly on A4 paper
- [ ] **Single page content**: Confirm each exercise program prints as one complete page
- [ ] **Hospital header**: Verify exact Arabic branding appears in print header
- [ ] **Exercise images**: Confirm images scale properly and remain readable
- [ ] **Page breaks**: Verify content doesn't break inappropriately across pages
- [ ] **Chrome removal**: Confirm navigation, buttons, and UI elements don't appear in print

### ✅ Print Content Tests
- [ ] **Hospital name**: "مستشفى الملك عبدالله - بيشه" appears in header
- [ ] **Department name**: "مركز التاهيل الطبي - العلاج الطبيعي" appears in header
- [ ] **Exercise content**: All exercise descriptions and tips print clearly
- [ ] **Image quality**: Exercise images remain clear and properly sized
- [ ] **Footer information**: Appropriate footer with hospital information appears

### Test Steps:
1. Open HEP (Home Exercise Program) modal
2. Select any exercise program (e.g., "شلل الوجه")
3. Click "Print" button for that section
4. In print preview, verify:
   - Only the selected exercise content appears
   - Hospital branding is prominently displayed
   - Content fits on one A4 page
   - Images are clear and properly sized
5. Test with different exercise programs

**Expected Result**: Each exercise program prints as a clean, professional A4 page with proper hospital branding.

---

## 🌐 Language Toggle (Full i18n)

### ✅ Translation Coverage Tests
- [ ] **Button labels**: All buttons translate (Save, Cancel, Book, etc.)
- [ ] **Form labels**: All input labels translate (File Number, Provider, etc.)
- [ ] **Navigation items**: Menu items and view names translate (Day View, Week View, etc.)
- [ ] **Error messages**: All validation and error messages translate
- [ ] **Table headers**: Column headers and data labels translate
- [ ] **Modal titles**: All modal and dialog titles translate
- [ ] **Toast messages**: Success/error notifications translate
- [ ] **Dropdown options**: All select options and specialty names translate

### ✅ Layout & Direction Tests
- [ ] **RTL/LTR switch**: Document direction changes correctly with language
- [ ] **Text alignment**: Text aligns properly in both Arabic (right) and English (left)
- [ ] **Icon positioning**: Icons and UI elements position correctly in both directions
- [ ] **Layout preservation**: Overall layout structure remains intact in both languages
- [ ] **Responsive behavior**: Both languages work properly on mobile devices

### ✅ Persistence Tests
- [ ] **Reload persistence**: Language choice survives browser refresh
- [ ] **Tab persistence**: Language choice survives opening in new tabs
- [ ] **Session persistence**: Language choice survives browser restart

### Test Steps:
1. Start with Arabic (default) and verify all text is in Arabic
2. Click language toggle button to switch to English
3. Verify ALL text changes to English immediately:
   - Header and navigation
   - All buttons and labels
   - Modal content and forms
   - Error messages and tooltips
4. Refresh the page and verify English is maintained
5. Switch back to Arabic and verify complete translation
6. Open application in new tab and verify language preference is maintained

**Expected Result**: Complete translation of ALL user interface elements with proper RTL/LTR handling.

---

## 🚀 Netlify Deployment

### ✅ Build Process Tests
- [ ] **Successful build**: `npm run build` completes without errors
- [ ] **Asset generation**: All necessary files generated in `dist` folder
- [ ] **Asset optimization**: CSS/JS files are minified and optimized
- [ ] **Font inclusion**: Local fonts are properly bundled
- [ ] **Image assets**: All images (logos, exercise photos) are included

### ✅ Runtime Tests
- [ ] **Offline functionality**: Application works without internet connection
- [ ] **No external calls**: No network requests to external CDNs or APIs
- [ ] **SPA routing**: All routes work properly (no 404s on refresh)
- [ ] **Asset loading**: All CSS, JS, and image assets load correctly
- [ ] **Security headers**: Proper security headers are present

### ✅ Header Validation Tests
- [ ] **Valid paths**: All header path patterns are correctly formatted
- [ ] **Security headers**: X-Frame-Options, CSP, and other security headers present
- [ ] **Cache headers**: Appropriate caching for assets vs HTML
- [ ] **No invalid patterns**: No glob patterns that could cause deployment failures

### Test Steps:
1. Run `npm run build` locally and verify no errors
2. Deploy to Netlify and verify successful deployment
3. Test the deployed application:
   - Navigate to all major pages
   - Refresh pages to test SPA routing
   - Test offline by disconnecting internet
   - Verify all images and styles load
4. Check browser developer tools for:
   - No 404 errors
   - No external network requests
   - Proper security headers

**Expected Result**: Application deploys successfully and runs completely offline with all features functional.

---

## 🔍 Cross-Browser & Device Testing

### ✅ Desktop Browsers
- [ ] **Chrome**: All features work correctly
- [ ] **Firefox**: All features work correctly  
- [ ] **Safari**: All features work correctly
- [ ] **Edge**: All features work correctly

### ✅ Mobile Devices
- [ ] **iOS Safari**: Touch interactions and responsive design work
- [ ] **Android Chrome**: Touch interactions and responsive design work
- [ ] **Mobile keyboards**: Text input works properly with Arabic/English

### ✅ Tablet Devices
- [ ] **iPad**: Layout adapts properly to tablet screen size
- [ ] **Android tablets**: Layout adapts properly to tablet screen size

---

## ✅ Overall System Integration

### ✅ End-to-End Workflow Tests
- [ ] **Complete booking flow**: From calendar view through booking confirmation
- [ ] **Language switching during booking**: Verify forms work in both languages
- [ ] **Print after booking**: Book appointment, then print exercise program
- [ ] **Filter and book**: Apply filters, view stats, then book appointment
- [ ] **Free booking to print**: Use free booking, then print related materials

### ✅ Data Integrity Tests
- [ ] **Existing data compatibility**: Old appointments and settings work with new system
- [ ] **Cross-language data**: Data entered in one language displays correctly in other
- [ ] **Audit trail consistency**: All booking actions properly logged regardless of method

---

## 🎯 Acceptance Criteria Verification

### Final Checklist
- [ ] Visual polish achieved without changing layout architecture
- [ ] Friday/Saturday never shown by default in any view
- [ ] Free booking modal accepts any time between 08:00-15:30
- [ ] Print produces single A4 page with exact hospital branding
- [ ] Language toggle provides complete translation (not just direction)
- [ ] Netlify deployment succeeds with zero invalid headers
- [ ] Application runs fully offline with no external dependencies

---

## 📝 Testing Notes

**Environment**: [Browser/Device/OS]
**Date Tested**: [Date]
**Tester**: [Name]

**Issues Found**:
[List any issues discovered during testing]

**Recommendations**:
[Any suggestions for improvements or additional testing]