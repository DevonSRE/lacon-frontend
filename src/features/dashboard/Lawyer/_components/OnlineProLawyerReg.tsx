import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import Input from '@/components/form/input/InputField';

export default function ProBonoForm() {
  const [form, setForm] = useState({ agree: false });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  return (
    <ScrollArea className="h-screen">
      <div className="max-w-3xl mx-auto p-10 space-y-8">
        <div className="flex justify-center">
          <h1 className="text-2xl  font-bold text-center max-w-sm">Online Pro Bono Lawyer Registration Form</h1>
        </div>
        <hr />

        {/* SECTION 1 */}
        <section className="space-y-4">
          <h2 className="font-semibold text-lg">SECTION 1: Personal Details and Office Info</h2>
          {['Lawyer’s Name', 'State of Practice', 'Email Address', 'Mobile Phone Number', 'Alternate Number', 'State Bar Membership'].map(label => (
            <div key={label}>

              <Input label={label} name={label.toLowerCase().replace(/ /g, '_')} onChange={handleChange} required />
            </div>
          ))}
          {['Name of Law Firm/Organization', 'Law Firm/Organization Address'].map(label => (
            <div key={label}>
              <Label>{label}</Label>
              <Textarea name={label.toLowerCase().replace(/ /g, '_')} onChange={handleChange} required />
            </div>
          ))}
          <div>
            <Input label="Most Contactable Call No" name="most_contactable_call_no" onChange={handleChange} required />
          </div>
        </section>

        {/* SECTION 2 */}
        <section className="space-y-4">
          <h2 className="font-semibold text-lg">SECTION 2: Experience in Criminal Law Practice</h2>
          {['Below 2 years', '2–5 years', '5–10 years', 'Above 10 years'].map(option => (
            <label key={option} className="flex items-center space-x-2">
              <input type="radio" name="experience" value={option} onChange={handleChange} />
              <span>{option}</span>
            </label>
          ))}
        </section>

        {/* SECTION 3 */}
        <section className="space-y-4">
          <h2 className="font-semibold text-lg">SECTION 3: Pro Bono Case Handling Capacity</h2>
          {['1 case at a time', '2 cases at a time', '3–4 cases at a time', '5 or more cases at a time'].map(option => (
            <label key={option} className="flex items-center space-x-2">
              <input type="radio" name="case_capacity" value={option} onChange={handleChange} />
              <span>{option}</span>
            </label>
          ))}
        </section>

        {/* SECTION 4 */}
        <section className="space-y-4">
          <h2 className="font-semibold text-lg">SECTION 4: Criminal Matters Preference</h2>
          {['Appellate Courts', 'High Courts', 'Magistrate Courts', 'Customary Court', 'Sharia Court', 'Area Court'].map(option => (
            <label key={option} className="flex items-center space-x-2">
              <input type="checkbox" name="court_preference" value={option} onChange={handleChange} />
              <span>{option}</span>
            </label>
          ))}
        </section>

        {/* SECTION 5 */}
        <section className="space-y-4">
          <h2 className="font-semibold text-lg">SECTION 5: Acknowledgement & Undertaking</h2>
          <p className="text-sm">
            By submitting this form, I certify that the information provided is true and accurate. I undertake to render free legal services with the same professional standards as paid services, and understand that LACOM may withdraw my assigned cases if I fail to diligently perform my duties.
          </p>
          <label className="flex items-center space-x-2">
            <input type="checkbox" name="agree" onChange={handleChange} />
            <span>I agree</span>
          </label>
        </section>

        <Button variant="default" disabled={!form.agree} className='w-full h-11 bg-[#EB4335]'>Submit Form</Button>
      </div>
    </ScrollArea>

  );
}
