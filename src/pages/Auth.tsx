
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Building, DollarSign, Users, Shield, Mail, Lock, User, UserCheck, Eye, EyeOff } from "lucide-react";

const Auth = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const features = [
    { icon: DollarSign, title: "Gestion Budget", desc: "Contrôlez vos budgets en temps réel" },
    { icon: Building, title: "Multi-Départements", desc: "Gérez plusieurs départements efficacement" },
    { icon: Users, title: "Collaboration", desc: "Travaillez en équipe sur vos projets" },
    { icon: Shield, title: "Sécurité", desc: "Données protégées et cryptées" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A1A24] via-[#2A2A3A] to-[#1A1A24] flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        
        {/* Left Side - Branding & Features */}
        <div className="hidden lg:block space-y-8 text-white">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="h-12 w-12">
                <svg width="48" height="48" viewBox="0 0 69 70" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clipPath="url(#clip0_682_22287)">
                    <path fillRule="evenodd" clipRule="evenodd" d="M11.09 61.4H28.46V69.32H0.669983V34.9H20.37L24.98 42.82H11.1V48.5H23.66V55.72H11.1V61.4H11.09ZM46.94 34.9L41.04 46.13L35.16 34.9H23.64L35.77 55.72V69.32H46.17V55.72L58.3 34.9H46.94Z" fill="white"/>
                    <path fillRule="evenodd" clipRule="evenodd" d="M68.67 12.81V0L0 24.83L68.67 12.81Z" fill="#FFE600"/>
                  </g>
                  <defs>
                    <clipPath id="clip0_682_22287">
                      <rect width="68.67" height="69.32" fill="white"/>
                    </clipPath>
                  </defs>
                </svg>
              </div>
              <h1 className="text-4xl font-bold">BudgetFlow</h1>
            </div>
            <p className="text-xl text-gray-300">
              Plateforme de gestion financière pour employés et managers
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <Icon className="h-8 w-8 text-[#FFE600] mb-3" />
                  <h3 className="font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-300">{feature.desc}</p>
                </div>
              );
            })}
          </div>

          <div className="bg-gradient-to-r from-[#FFE600]/20 to-transparent rounded-lg p-6 border border-[#FFE600]/30">
            <h3 className="text-lg font-semibold text-[#FFE600] mb-2">Accès Sécurisé</h3>
            <p className="text-gray-300">Connectez-vous avec vos identifiants d'entreprise pour accéder à votre tableau de bord personnalisé.</p>
          </div>
        </div>

        {/* Right Side - Auth Forms */}
        <div className="w-full max-w-md mx-auto">
          <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-0">
            <CardHeader className="text-center space-y-2">
              <div className="mx-auto w-16 h-16 bg-[#1A1A24] rounded-full flex items-center justify-center mb-4">
                <User className="h-8 w-8 text-[#FFE600]" />
              </div>
              <CardTitle className="text-2xl text-[#1A1A24]">Espace Collaborateur</CardTitle>
              <CardDescription className="text-gray-600">
                Accédez à votre tableau de bord financier
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="login" className="data-[state=active]:bg-[#1A1A24] data-[state=active]:text-white">
                    Connexion
                  </TabsTrigger>
                  <TabsTrigger value="register" className="data-[state=active]:bg-[#1A1A24] data-[state=active]:text-white">
                    Inscription
                  </TabsTrigger>
                </TabsList>

                {/* Login Form */}
                <TabsContent value="login" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email" className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email professionnel
                    </Label>
                    <Input 
                      id="login-email" 
                      type="email" 
                      placeholder="votre.nom@entreprise.com"
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password" className="flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      Mot de passe
                    </Label>
                    <div className="relative">
                      <Input 
                        id="login-password" 
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="h-11 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <Button className="w-full h-11 bg-[#1A1A24] hover:bg-[#2A2A3A] text-white">
                    Se connecter
                  </Button>

                  <div className="text-center">
                    <a href="#" className="text-sm text-[#1A1A24] hover:underline">
                      Mot de passe oublié ?
                    </a>
                  </div>
                </TabsContent>

                {/* Register Form */}
                <TabsContent value="register" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="first-name">Prénom</Label>
                      <Input id="first-name" placeholder="Jean" className="h-11" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last-name">Nom</Label>
                      <Input id="last-name" placeholder="Dupont" className="h-11" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-email" className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email professionnel
                    </Label>
                    <Input 
                      id="register-email" 
                      type="email" 
                      placeholder="jean.dupont@entreprise.com"
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role" className="flex items-center gap-2">
                      <UserCheck className="h-4 w-4" />
                      Rôle dans l'entreprise
                    </Label>
                    <Select>
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Sélectionnez votre rôle" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="employee">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <span>Employé</span>
                            <Badge variant="outline" className="ml-auto">Accès Standard</Badge>
                          </div>
                        </SelectItem>
                        <SelectItem value="manager">
                          <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4" />
                            <span>Manager</span>
                            <Badge variant="outline" className="ml-auto">Accès Étendu</Badge>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="department">Département</Label>
                    <Select>
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Sélectionnez votre département" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="finance">Finance</SelectItem>
                        <SelectItem value="hr">Ressources Humaines</SelectItem>
                        <SelectItem value="it">Informatique</SelectItem>
                        <SelectItem value="marketing">Marketing</SelectItem>
                        <SelectItem value="operations">Opérations</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-password" className="flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      Mot de passe
                    </Label>
                    <div className="relative">
                      <Input 
                        id="register-password" 
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="h-11 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
                    <div className="relative">
                      <Input 
                        id="confirm-password" 
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="h-11 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <Button className="w-full h-11 bg-[#1A1A24] hover:bg-[#2A2A3A] text-white">
                    Créer mon compte
                  </Button>

                  <p className="text-xs text-gray-600 text-center">
                    En créant un compte, vous acceptez nos conditions d'utilisation et notre politique de confidentialité.
                  </p>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Mobile Branding */}
          <div className="lg:hidden mt-8 text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="h-8 w-8">
                <svg width="32" height="32" viewBox="0 0 69 70" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clipPath="url(#clip0_682_22287)">
                    <path fillRule="evenodd" clipRule="evenodd" d="M11.09 61.4H28.46V69.32H0.669983V34.9H20.37L24.98 42.82H11.1V48.5H23.66V55.72H11.1V61.4H11.09ZM46.94 34.9L41.04 46.13L35.16 34.9H23.64L35.77 55.72V69.32H46.17V55.72L58.3 34.9H46.94Z" fill="white"/>
                    <path fillRule="evenodd" clipRule="evenodd" d="M68.67 12.81V0L0 24.83L68.67 12.81Z" fill="#FFE600"/>
                  </g>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white">BudgetFlow</h2>
            </div>
            <p className="text-gray-300">Gestion financière simplifiée</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
