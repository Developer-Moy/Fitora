import re

file_path = "client/src/app/profile/page.tsx"
with open(file_path, "r") as f:
    content = f.read()

# The start and end markers
start_marker = "{/* ── 6. Edit Profile Modal (Includes Local & ImgBB Upload) ── */}"
end_marker = "</AnimatePresence>"

# The new modal code
new_modal = """{/* ── 6. Edit Profile Modal (Includes Local & ImgBB Upload) ── */}
      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-hidden">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-2xl bg-black border border-white/20 rounded-2xl p-4 sm:p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-white/20 pb-3">
                <div>
                  <h2 className="text-lg sm:text-xl font-black uppercase text-white font-sans leading-none">
                    Edit Profile
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="text-white/60 hover:text-white text-xs font-bold px-2 py-1"
                >
                  ✕ Close
                </button>
              </div>

              {/* Form Fields & Photo (Compact Grid Layout) */}
              <form onSubmit={handleSaveProfile} className="space-y-3 sm:space-y-4">
                
                {/* Top Row: Photo + Name + Phone */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center">
                  
                  {/* Photo Section (Compact) */}
                  <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl p-2.5 shrink-0 w-full sm:w-auto">
                    <div className="w-12 h-12 rounded-full bg-black border border-white/20 overflow-hidden flex items-center justify-center text-white font-bold text-lg shrink-0">
                      {editAvatarUrl ? (
                        <img src={editAvatarUrl} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <span>{userInitial}</span>
                      )}
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <div className="flex gap-1.5">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={isUploading}
                          className="bg-white text-black font-bold text-[10px] px-2.5 py-1 rounded-full hover:bg-neutral-200 transition-all flex items-center gap-1"
                        >
                          {isUploading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />}
                          Upload
                        </button>
                        {editAvatarUrl && (
                          <button
                            type="button"
                            onClick={handleRemovePhoto}
                            className="bg-red-500/20 text-red-400 hover:bg-red-500/30 font-bold text-[10px] px-2.5 py-1 rounded-full transition-colors flex items-center gap-1"
                          >
                            <Trash2 className="w-3 h-3" /> Remove
                          </button>
                        )}
                      </div>
                      <input
                        type="url"
                        value={editAvatarUrl}
                        onChange={(e) => setEditAvatarUrl(e.target.value)}
                        placeholder="Paste URL..."
                        className="w-full bg-black border border-white/20 rounded-md px-2 py-1 text-[10px] text-white placeholder:text-white/40 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Name & Phone */}
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                    <div className="space-y-1">
                      <label className="text-[10px] sm:text-xs font-bold uppercase text-white/80">Full Name</label>
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        required
                        className="w-full bg-black border border-white/20 rounded-lg px-3 py-1.5 sm:py-2 text-xs text-white focus:outline-none focus:border-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] sm:text-xs font-bold uppercase text-white/80">Phone</label>
                      <input
                        type="text"
                        value={editPhone}
                        onChange={(e) => setEditPhone(e.target.value)}
                        placeholder="+880 17..."
                        className="w-full bg-black border border-white/20 rounded-lg px-3 py-1.5 sm:py-2 text-xs text-white focus:outline-none focus:border-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Middle Row: Details (5 items in tight grid) */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-white/80">Gender</label>
                    <select
                      value={editGender}
                      onChange={(e) => setEditGender(e.target.value)}
                      className="w-full bg-black border border-white/20 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-white"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-white/80">Weight (kg)</label>
                    <input
                      type="number"
                      value={editWeight}
                      onChange={(e) => setEditWeight(e.target.value)}
                      className="w-full bg-black border border-white/20 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-white/80">Height (cm)</label>
                    <input
                      type="number"
                      value={editHeight}
                      onChange={(e) => setEditHeight(e.target.value)}
                      className="w-full bg-black border border-white/20 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-white"
                    />
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-[10px] font-bold uppercase text-white/80">Fitness Goal</label>
                    <select
                      value={editGoal}
                      onChange={(e) => setEditGoal(e.target.value)}
                      className="w-full bg-black border border-white/20 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-white"
                    >
                      <option value="Bulking & Muscle Gain">Bulking & Muscle Gain</option>
                      <option value="Fat Loss & Cutting">Fat Loss & Cutting</option>
                      <option value="Strength & Conditioning">Strength & Conditioning</option>
                      <option value="Maintenance">Maintenance</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-white/80">Primary Branch</label>
                  <select
                    value={editBranch}
                    onChange={(e) => setEditBranch(e.target.value)}
                    className="w-full bg-black border border-white/20 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-white"
                  >
                    <option value="Gulshan-2 Flagship Branch">Gulshan-2 Flagship</option>
                    <option value="Banani Platinum Lounge">Banani Platinum</option>
                    <option value="Dhanmondi Athletic Center">Dhanmondi Athletic</option>
                    <option value="Uttara Sector-4 Hub">Uttara Sector-4</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-white/80">Athlete Bio</label>
                  <input
                    type="text"
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    placeholder="Short athlete bio or fitness aspiration..."
                    className="w-full bg-black border border-white/20 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-white"
                  />
                </div>

                <div className="flex items-center gap-3 pt-2 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="flex-1 bg-black text-white border border-white/20 font-bold text-xs px-4 py-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="flex-1 bg-white text-black border border-white font-extrabold text-xs px-4 py-2 rounded-full hover:bg-neutral-200 transition-all cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>"""

start_idx = content.find(start_marker)
end_idx = content.find(end_marker, start_idx) + len(end_marker)

if start_idx != -1 and end_idx != -1:
    new_content = content[:start_idx] + new_modal + content[end_idx:]
    with open(file_path, "w") as f:
        f.write(new_content)
    print("Modal successfully updated!")
else:
    print("Could not find markers.")
