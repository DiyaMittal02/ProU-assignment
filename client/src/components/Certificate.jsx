import { useState } from 'react';
import { Award, Download, Share2, X } from 'lucide-react';
import './Certificate.css';

const Certificate = ({ show, onClose, certificateData }) => {
    if (!show) return null;

    const {
        userName,
        quizTitle,
        score,
        date,
        certificateId
    } = certificateData;

    const handleDownload = () => {
        // Create certificate HTML
        const certificateHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            margin: 0;
            padding: 40px;
            font-family: 'Georgia', serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          }
          .certificate {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 60px;
            border: 20px solid #f0f0f0;
            box-shadow: 0 0 50px rgba(0,0,0,0.3);
          }
          .header {
            text-align: center;
            margin-bottom: 40px;
          }
          .logo {
            font-size: 48px;
            margin-bottom: 10px;
          }
          .title {
            font-size: 48px;
            color: #667eea;
            margin: 20px 0;
            font-weight: bold;
          }
          .subtitle {
            font-size: 20px;
            color: #666;
          }
          .content {
            text-align: center;
            margin: 40px 0;
          }
          .recipient {
            font-size: 36px;
            color: #333;
            margin: 20px 0;
            font-weight: bold;
            border-bottom: 2px solid #667eea;
            display: inline-block;
            padding-bottom: 10px;
          }
          .achievement {
            font-size: 18px;
            color: #666;
            margin: 30px 0;
            line-height: 1.8;
          }
          .quiz-info {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 10px;
            margin: 30px 0;
          }
          .score {
            font-size: 48px;
            color: #667eea;
            font-weight: bold;
          }
          .footer {
            margin-top: 60px;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
          }
          .signature {
            text-align: center;
          }
          .signature-line {
            border-top: 2px solid #333;
            width: 200px;
            margin: 0 auto 10px;
          }
          .date {
            color: #666;
            font-size: 14px;
          }
          .certificate-id {
            color: #999;
            font-size: 12px;
            text-align: center;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="certificate">
          <div class="header">
            <div class="logo">⚖️</div>
            <h1 class="title">Certificate of Achievement</h1>
            <p class="subtitle">Legal Awareness Portal</p>
          </div>
          
          <div class="content">
            <p style="font-size: 20px; color: #666;">This is to certify that</p>
            <h2 class="recipient">${userName}</h2>
            <p class="achievement">
              has successfully completed the<br/>
              <strong style="color: #667eea; font-size: 24px;">${quizTitle}</strong><br/>
              and demonstrated excellent knowledge of legal concepts
            </p>
            
            <div class="quiz-info">
              <p style="margin: 0; color: #666;">Score Achieved</p>
              <div class="score">${score}%</div>
            </div>
          </div>
          
          <div class="footer">
            <div class="signature">
              <div class="signature-line"></div>
              <p style="margin: 5px 0; font-weight: bold;">Director</p>
              <p class="date">Legal Awareness Portal</p>
            </div>
            
            <div class="signature">
              <div class="signature-line"></div>
              <p style="margin: 5px 0; font-weight: bold;">Date</p>
              <p class="date">${new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })}</p>
            </div>
          </div>
          
          <p class="certificate-id">Certificate ID: ${certificateId}</p>
        </div>
      </body>
      </html>
    `;

        // Create blob and download
        const blob = new Blob([certificateHTML], { type: 'text/html' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `certificate-${certificateId}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: 'My Certificate',
                text: `I scored ${score}% in ${quizTitle}!`,
                url: window.location.href
            });
        } else {
            alert('Sharing not supported on this browser');
        }
    };

    return (
        <div className="certificate-modal-overlay" onClick={onClose}>
            <div className="certificate-modal" onClick={(e) => e.stopPropagation()}>
                <button className="close-button" onClick={onClose}>
                    <X size={24} />
                </button>

                <div className="certificate-preview">
                    <div className="certificate-header">
                        <div className="certificate-logo">⚖️</div>
                        <h1 className="certificate-title">Certificate of Achievement</h1>
                        <p className="certificate-subtitle">Legal Awareness Portal</p>
                    </div>

                    <div className="certificate-content">
                        <p className="certificate-intro">This is to certify that</p>
                        <h2 className="certificate-recipient">{userName}</h2>
                        <p className="certificate-achievement">
                            has successfully completed the<br />
                            <strong>{quizTitle}</strong><br />
                            and demonstrated excellent knowledge of legal concepts
                        </p>

                        <div className="certificate-score-box">
                            <p>Score Achieved</p>
                            <div className="certificate-score">{score}%</div>
                        </div>
                    </div>

                    <div className="certificate-footer">
                        <div className="certificate-signature">
                            <div className="signature-line"></div>
                            <p className="signature-title">Director</p>
                            <p className="signature-org">Legal Awareness Portal</p>
                        </div>

                        <div className="certificate-signature">
                            <div className="signature-line"></div>
                            <p className="signature-title">Date</p>
                            <p className="signature-date">
                                {new Date(date).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </p>
                        </div>
                    </div>

                    <p className="certificate-id">Certificate ID: {certificateId}</p>
                </div>

                <div className="certificate-actions">
                    <button className="btn btn-primary" onClick={handleDownload}>
                        <Download size={18} />
                        Download Certificate
                    </button>
                    <button className="btn btn-outline" onClick={handleShare}>
                        <Share2 size={18} />
                        Share
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Certificate;
